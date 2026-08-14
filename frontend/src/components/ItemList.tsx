import { ReactNode } from "react";
import { Item } from "../types";
import ItemCard from "./ItemCard";

interface ItemListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

const ItemList = ({ items, onEdit, onDelete }: ItemListProps): ReactNode => {
  if (items.length === 0) {
    return <div className="empty-state">No items found. Create one above!</div>;
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ItemList;
