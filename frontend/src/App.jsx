import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://kenospace.online/api/items";

function App() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  // ==========================
  // GET ITEMS
  // ==========================

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();

      setItems(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  // Load items when component starts
  useEffect(() => {
    fetchItems();
  }, []);

  // ==========================
  // HANDLE INPUT
  // ==========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // ==========================
  // CREATE / UPDATE
  // ==========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Item name is required");
      return;
    }

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      await response.json();

      resetForm();

      fetchItems();
    } catch (error) {
      console.error(error);
      alert("Failed to save item");
    }
  };

  // ==========================
  // EDIT
  // ==========================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
    });
  };

  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      fetchItems();
    } catch (error) {
      console.error(error);
      alert("Failed to delete item");
    }
  };

  // ==========================
  // RESET FORM
  // ==========================

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
    });

    setEditingId(null);
  };

  return (
    <div className="container">
      <h1>Items CRUD App</h1>

      {/* FORM */}

      <div className="card">
        <h2>{editingId ? "Edit Item" : "Add Item"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </div>

          <div className="form-group">
            <label>Price</label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="buttons">
            <button type="submit" className="btn-primary">
              {editingId ? "Update Item" : "Add Item"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLE */}

      <div className="card">
        <h2>Items</h2>

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <table>
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
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
