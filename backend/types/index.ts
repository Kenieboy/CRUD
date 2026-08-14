export type ItemStatus = "active" | "inactive";
export type ItemPriority = "low" | "medium" | "high";

export interface Item {
  id: number;
  title: string;
  description: string | null;
  status: ItemStatus;
  priority: ItemPriority;
  created_at: Date;
  updated_at: Date;
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
  status?: ItemStatus;
  priority?: ItemPriority;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ msg: string; path?: string }>;
  count?: number;
}

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}
