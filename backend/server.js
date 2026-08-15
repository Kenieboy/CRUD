import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================
// GET ALL ITEMS
// ==========================

app.get("/api/items", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM items ORDER BY id DESC");

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch items",
    });
  }
});

// ==========================
// GET SINGLE ITEM
// ==========================

app.get("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch item",
    });
  }
});

// ==========================
// CREATE ITEM
// ==========================

app.post("/api/items", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO items
            (name, description, price)
            VALUES (?, ?, ?)`,
      [name, description || "", price || 0],
    );

    const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create item",
    });
  }
});

// ==========================
// UPDATE ITEM
// ==========================

app.put("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price } = req.body;

    const [result] = await pool.query(
      `UPDATE items
             SET name = ?,
                 description = ?,
                 price = ?
             WHERE id = ?`,
      [name, description || "", price || 0, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [id]);

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update item",
    });
  }
});

// ==========================
// DELETE ITEM
// ==========================

app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM items WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete item",
    });
  }
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");

    res.json({
      success: true,
      message: "MySQL connection is working",
      data: rows,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==========================
// TEST ROUTE
// ==========================

app.get("/", (req, res) => {
  res.json({
    message: "CRUD API is running",
  });
});

// ==========================
// START SERVER
// ==========================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
