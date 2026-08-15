import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// GET all items
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

// CREATE item
app.post("/api/items", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const [result] = await pool.execute(
      "INSERT INTO items (name, description, price) VALUES (?, ?, ?)",
      [name, description, price],
    );

    res.status(201).json({
      message: "Item created successfully",
      id: (result as any).insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create item",
    });
  }
});

// UPDATE item
app.put("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    await pool.execute(
      `UPDATE items
       SET name = ?, description = ?, price = ?
       WHERE id = ?`,
      [name, description, price, id],
    );

    res.json({
      message: "Item updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update item",
    });
  }
});

// DELETE item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute("DELETE FROM items WHERE id = ?", [id]);

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
