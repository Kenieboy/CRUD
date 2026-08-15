import { useEffect, useState } from "react";
import { getItems, createItem, updateItem, deleteItem, type Item } from "./api";

function App() {
  const [items, setItems] = useState<Item[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadItems() {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const item = {
      name,
      description,
      price: Number(price),
    };

    if (editingId === null) {
      await createItem(item);
    } else {
      await updateItem(editingId, item);
    }

    clearForm();
    loadItems();
  }

  function handleEdit(item: Item) {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description);
    setPrice(String(item.price));
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this item?")) {
      return;
    }

    await deleteItem(id);
    loadItems();
  }

  function clearForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Items CRUD</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Price</label>
          <br />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">
          {editingId === null ? "Add Item" : "Update Item"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={clearForm}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>Items</h2>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>

              <td>{item.name}</td>

              <td>{item.description}</td>

              <td>₱{Number(item.price).toFixed(2)}</td>

              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>

                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ marginLeft: "5px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
