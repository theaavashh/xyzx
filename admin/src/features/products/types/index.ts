import type { Product } from '@/types';

export interface ProductsApiResponse {
  success: boolean;
  data: Product[] | { products: Product[] };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface ProductApiResponse {
  success: boolean;
  data: Record<string, unknown>;
  message?: string;
}

export interface SimpleActionResponse {
  success: boolean;
  message?: string;
}

export interface CategoryFilterItem {
  id: string;
  name: string;
  slug: string;
  children?: Array<{ id: string; name: string; slug: string }>;
}
