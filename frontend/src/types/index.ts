export type ItemStatus = "active" | "inactive";
export type ItemPriority = "low" | "medium" | "high";

export interface Item {
  id: number;
  title: string;
  description: string | null;
  status: ItemStatus;
  priority: ItemPriority;
  created_at: string;
  updated_at: string;
}

export interface CreateItemInput {
  title: string;
  description?: string;
  status?: ItemStatus;
  priority?: ItemPriority;
}

export interface UpdateItemInput {
  title?: string;
  description?: string;
  status?: ItemStatus;
  priority?: ItemPriority;
}

export interface ItemFilters {
  status?: ItemStatus; // optional filter by status
  priority?: ItemPriority; // optional filter by priority
  search?: string; // optional text search in title/description
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ msg: string; path?: string }>;
  count?: number;
}
