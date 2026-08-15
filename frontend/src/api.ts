const API_URL = "http://localhost:5000/api/items";

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

export async function getItems(): Promise<Item[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }

  return response.json();
}

export async function createItem(item: Omit<Item, "id">) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  return response.json();
}

export async function updateItem(id: number, item: Omit<Item, "id">) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  return response.json();
}

export async function deleteItem(id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return response.json();
}
