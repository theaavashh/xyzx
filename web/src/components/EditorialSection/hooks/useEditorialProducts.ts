"use client";

import { useQuery } from '@tanstack/react-query';
import type { Product } from '../types';

const PRODUCTS_QUERY_KEY = ['home', 'editorial-products'];

async function fetchProducts(featureType: string | null): Promise<Product[]> {
  try {
    const params = new URLSearchParams({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: '10',
      isActive: 'true',
    });
    if (featureType) {
      params.set(featureType, 'true');
    }

    const response = await fetch(`/api/v1/products?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.success || !data.data || !Array.isArray(data.data)) return [];

    return data.data.map((p: Record<string, unknown>): Product => ({
      id: (p.id as number) ?? 0,
      name: (p.name as string) ?? '',
      category: (p.category as Record<string, unknown>)?.name as string ?? 'Uncategorized',
      price: (p.price as number) ?? 0,
      originalPrice: (p.originalPrice as number) ?? (p.price as number) ?? 0,
      rating: 4.5,
      reviews: Math.floor(Math.random() * 100) + 10,
      image: (p.thumbnail as string) ?? ((p.images as string[])?.[0]) ?? '',
      images: (p.images as string[]) ?? [],
      isNew: (p.isNew as boolean) ?? false,
      badge: (p.isNew as boolean) ? 'NEW' : (p.isOnSale as boolean) ? 'SALE' : '',
    }));
  } catch {
    return [];
  }
}

export function useEditorialProducts(featureType: string | null = null) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, featureType],
    queryFn: () => fetchProducts(featureType),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}
