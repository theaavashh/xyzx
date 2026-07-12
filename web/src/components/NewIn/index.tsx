'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NewInProduct } from './types';
import { NewInCard } from './components/NewInCard';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

async function fetchNewInProducts(): Promise<NewInProduct[]> {
  try {
    const params = new URLSearchParams({
      isNew: 'true',
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
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      image: p.thumbnail || p.images?.[0] || '',
      hoverImage: p.thumbnail || p.images?.[0] || '',
      badge: p.isNew ? 'New' : p.isOnSale ? 'Sale' : undefined,
      colors: (p.selectedColors || [])?.map((c: string) => ({ name: c, hex: c })),
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
    <section className="py-14 md:py-20 bg-white overflow-hidden">
      <div className="max-w-9xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-5xl lastik text-black uppercase tracking-tight">
              New In
            </h2>
            <p className="text-sm md:text-base text-gray-500 mt-1.5 tracking-wide">
              This week&apos;s latest arrivals
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm text-gray-500 hover:text-black font-medium transition-colors tracking-wider uppercase hidden sm:block"
          >
            Shop All
          </Link>
        </div>
      </div>

      <div
        className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-6 lg:px-8 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[65vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] max-w-sm">
            <NewInCard product={product} priority={false} />
          </div>
        ))}
      </div>
    </section>
  );
}
