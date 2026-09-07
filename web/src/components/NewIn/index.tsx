'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NewInProduct } from './types';
import { NewInCard } from './components/NewInCard';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

async function fetchNewInProducts(): Promise<NewInProduct[]> {
  try {
    const params = new URLSearchParams({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: '10',
      isActive: 'true',
    });
    const res = await fetch(`${API_BASE}/api/v1/products?${params}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return [];
    return json.data.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      image: p.thumbnail || p.images?.[0] || '',
      hoverImage: p.thumbnail || p.images?.[0] || '',
      badge: p.isNew ? 'New' : p.isOnSale ? 'Sale' : undefined,
      colors: (p.selectedColors || [])?.map((c: string) => ({ name: c, hex: c })),
      patterns: (p.selectedPatterns || [])?.map((name: string) => ({ name })),
      category: p.category ?? null,
    }));
  } catch {
    return [];
  }
}

export default function NewIn() {
  const [products, setProducts] = useState<NewInProduct[]>([]);

  useEffect(() => {
    fetchNewInProducts().then(setProducts);
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-8 md:py-12 bg-[#F7F6F3] overflow-hidden">
      <div className="max-w-9xl px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="bound-regular text-xl md:text-2xl lg:text-3xl font-medium text-zinc-900 tracking-wide">
          New Arrival
        </h2>
        <p className="mt-1 text-base text-zinc-600 tracking-wide">
          Freshly curated pieces, just for you
        </p>
      </div>

      <div
        className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-6 lg:px-8 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[48vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] max-w-sm">
            <NewInCard product={product} priority={false} />
          </div>
        ))}
      </div>
    </section>
  );
}
