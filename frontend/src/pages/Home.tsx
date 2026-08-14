import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  ReactElement,
} from "react";
import toast from "react-hot-toast";
import { get, post, put, del } from "../api/axios";
import { Item, CreateItemInput, UpdateItemInput } from "../types";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";

interface FilterState {
  status: "" | Item["status"];
  priority: "" | Item["priority"];
  search: string;
}

const Home = (): ReactElement => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    priority: "",
    search: "",
  });

  const fetchItems = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const response = await get<Item[]>("/items", { params });
      setItems(response.data || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch items",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = async (data: CreateItemInput): Promise<void> => {
    try {
      const response = await post<Item>("/items", data);
      if (response.data) {
        setItems((prev) => [response.data!, ...prev]);
        toast.success("Item created successfully!");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create item",
      );
    }
  };

  const handleUpdate = async (data: UpdateItemInput): Promise<void> => {
    if (!editingItem) return;
    try {
      const response = await put<Item>(`/items/${editingItem.id}`, data);
      if (response.data) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? response.data! : item,
          ),
        );
        setEditingItem(null);
        toast.success("Item updated successfully!");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update item",
      );
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await del<null>(`/items/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item deleted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item",
      );
    }
  };

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <header>
        <h1>📝 CRUD Application</h1>
        <p>Manage your items with ease</p>
      </header>

      <ItemForm
        item={editingItem}
        onSubmit={editingItem ? handleUpdate : handleCreate}
        onCancel={() => setEditingItem(null)}
      />

      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search items..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <ItemList
          items={items}
          onEdit={setEditingItem}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Home;
