import type { Category } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  internalLink: string;
  isActive: boolean;
}

interface ApiCategoryResponse {
  success: boolean;
  data?: ApiCategory[];
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/api/v1/categories?isActive=true`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) return [];

  const json: ApiCategoryResponse = await response.json();

  if (!json.success || !json.data) return [];

  return json.data
    .filter((cat) => cat.isActive !== false)
    .map((cat, index) => ({
      id: cat.id,
      title: cat.name,
      image: cat.image,
      link: cat.internalLink || `/products/${cat.slug}`,
      isActive: cat.isActive,
      order: index,
    }));
}
