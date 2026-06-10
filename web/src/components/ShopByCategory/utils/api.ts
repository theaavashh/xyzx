import type { Category, CategoryResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/api/v1/public/shop-by-categories/active`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) return [];

  const json: CategoryResponse = await response.json();

  if (!json.success || !json.data) return [];

  return json.data.filter((cat) => cat.isActive !== false);
}
