import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/database.js";
import {
  Item,
  CreateItemInput,
  UpdateItemInput,
  ItemFilters,
} from "../types/index.js";

interface ItemRow extends Item, RowDataPacket {}

class ItemModel {
  async findAll(filters: ItemFilters = {}): Promise<Item[]> {
    let query = "SELECT * FROM items WHERE 1=1";
    const params: (string | number)[] = [];

    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }
    if (filters.priority) {
      query += " AND priority = ?";
      params.push(filters.priority);
    }
    if (filters.search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await pool.execute<ItemRow[]>(query, params);
    return rows;
  }

  async findById(id: number): Promise<Item | null> {
    const [rows] = await pool.execute<ItemRow[]>(
      "SELECT * FROM items WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  }

  async create(input: CreateItemInput): Promise<Item> {
    const {
      title,
      description = null,
      status = "active",
      priority = "medium",
    } = input;

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO items (title, description, status, priority) VALUES (?, ?, ?, ?)",
      [title, description, status, priority],
    );

    const item = await this.findById(result.insertId);
    if (!item) throw new Error("Failed to create item");
    return item;
  }

  async update(id: number, updates: UpdateItemInput): Promise<Item | null> {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    const updateMap: Record<string, string | number | undefined | null> = {
      title: updates.title,
      description: updates.description ?? null,
      status: updates.status,
      priority: updates.priority,
    };

    for (const [key, value] of Object.entries(updateMap)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE items SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM items WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

export default new ItemModel();
