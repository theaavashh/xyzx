'use client';

import { memo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug?: string;
  category?: { id: string; name: string; slug: string } | null;
}

interface WomenItemsConfig {
  image: string;
  description: string;
  buttonTitle: string;
  buttonCta: string;
  filterType: 'gender' | 'category';
  filterValue: string;
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=85';

const DEFAULT_CONFIG: WomenItemsConfig = {
  image: HERO_IMAGE,
  description:
    "Discover women's pieces in modern silhouettes, refined fabrics, and easy-to-style shades. Made for everyday comfort, from casual weekends to evenings out.",
  buttonTitle: 'View all',
  buttonCta: '/products',
  filterType: 'gender',
  filterValue: 'Women',
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

async function fetchConfig(): Promise<WomenItemsConfig | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/women-items`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

async function fetchProducts(config: WomenItemsConfig): Promise<Product[]> {
  try {
    const params = new URLSearchParams({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: '6',
      isActive: 'true',
    });
    if (config.filterType === 'category') {
      params.set('categoryId', config.filterValue);
    } else {
      params.set('gender', config.filterValue);
    }

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
      slug: p.slug,
      category: p.category ?? null,
    }));
  } catch {
    return [];
  }
}

function ProductCard({ product }: { product: Product }) {
  const href = product.category?.slug && product.slug
    ? `/products/${product.category.slug}/${product.slug}`
    : product.slug
      ? `/products/all/${product.slug}`
      : `/products/all/${product.id}`;

  return (
    <Link href={href} className="group block w-[160px] flex-shrink-0">
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            sizes="120px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-zinc-200" />
        )}
        <div className="absolute bottom-2 left-2 flex h-9 w-9 items-center justify-center bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
          <ShoppingBag className="h-4 w-4 text-zinc-900" strokeWidth={1.5} />
        </div>
      </div>
      <div className="mt-3">
        <h4 className="line-clamp-2 text-sm font-medium leading-5 text-zinc-800">{product.name}</h4>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-zinc-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function WomenItems() {
  const [config, setConfig] = useState<WomenItemsConfig>(DEFAULT_CONFIG);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const cfg = await fetchConfig();
      const activeConfig = cfg ?? DEFAULT_CONFIG;
      if (!active) return;
      setConfig(activeConfig);
      const items = await fetchProducts(activeConfig);
      if (active) setProducts(items);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!products.length) return null;

  const heroImage = config.image || HERO_IMAGE;

  return (
    <section className="w-full bg-white py-4 sm:py-6">
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-4">
        <div className="grid overflow-hidden md:grid-cols-[1fr_1fr]">
          <div className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[680px]">
            <Image
              src={heroImage}
              alt="Women's Collection"
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-col bg-[#f6f6f6]">
            <div className="flex flex-1 flex-col px-6 pt-10 sm:px-10 sm:pt-12 lg:px-12 lg:pt-12">
              <p className="max-w-[600px] text-base leading-[1.5] text-zinc-900">
                {config.description}
              </p>

              <Link
                href={config.buttonCta}
                className="mt-8 flex h-[50px] w-[140px] items-center justify-center rounded-full bg-zinc-950 text-sm font-medium text-white transition-all duration-300 hover:bg-zinc-800 hover:scale-[1.02]"
              >
                {config.buttonTitle}
              </Link>
            </div>

            <div className="mt-10 min-w-0 px-6 pb-8 sm:px-10 lg:px-12">
              <div
                className="flex gap-6 overflow-x-auto scroll-smooth pb-3"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(WomenItems);
