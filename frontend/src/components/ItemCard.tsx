import { ReactNode } from "react";
import { Item, ItemPriority, ItemStatus } from "../types";

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

const priorityColors: Record<ItemPriority, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
};

const statusColors: Record<ItemStatus, string> = {
  active: "#dbeafe",
  inactive: "#f3f4f6",
};

const ItemCard = ({ item, onEdit, onDelete }: ItemCardProps): ReactNode => {
  return (
    <div
      className="item-card"
      style={{ backgroundColor: statusColors[item.status] }}
    >
      <div className="item-header">
        <h4>{item.title}</h4>
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityColors[item.priority] }}
        >
          {item.priority}
        </span>
      </div>

      <p className="item-description">{item.description || "No description"}</p>

      <div className="item-meta">
        <span className={`status-badge ${item.status}`}>{item.status}</span>
        <small>{new Date(item.created_at).toLocaleDateString()}</small>
      </div>

      <div className="item-actions">
        <button className="btn-edit" onClick={() => onEdit(item)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(item.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
