import { useState, useEffect, ChangeEvent, FormEvent, ReactNode } from "react";
import { Item, CreateItemInput, ItemStatus, ItemPriority } from "../types";

interface ItemFormProps {
  item: Item | null;
  onSubmit: (data: CreateItemInput) => void;
  onCancel: () => void;
}

interface FormState {
  title: string;
  description: string;
  status: ItemStatus;
  priority: ItemPriority;
}

const ItemForm = ({ item, onSubmit, onCancel }: ItemFormProps): ReactNode => {
  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    status: "active",
    priority: "medium",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        status: item.status || "active",
        priority: item.priority || "medium",
      });
    }
  }, [item]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(formData);
    if (!item) {
      setFormData({
        title: "",
        description: "",
        status: "active",
        priority: "medium",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <h3>{item ? "Edit Item" : "Create New Item"}</h3>

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter item title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Enter description"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {item ? "Update" : "Create"}
        </button>
        {item && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ItemForm;
