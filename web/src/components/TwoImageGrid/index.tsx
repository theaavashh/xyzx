'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

interface ProductCard {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  colors?: { name: string; hex: string }[];
}

interface LeftImage {
  src: string;
  alt: string;
  link?: string;
}

async function fetchLeftImage(): Promise<LeftImage | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/image-grid/active`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data?.length) return null;
    const item = json.data[0];
    return { src: item.src, alt: item.alt, link: item.link || undefined };
  } catch {
    return null;
  }
}

async function fetchProducts(): Promise<ProductCard[]> {
  try {
    const params = new URLSearchParams({
      isFeatured: 'true',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: '10',
      isActive: 'true',
    });
    const res = await fetch(`${API_BASE}/api/v1/products?${params}`);
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return [];
    return json.data.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      image: p.thumbnail || p.images?.[0] || '',
      hoverImage: p.thumbnail || p.images?.[0] || undefined,
      badge: p.isNew ? 'New' : p.isOnSale ? 'Sale' : undefined,
      colors: (p.selectedColors || [])?.map((c: string) => ({ name: c, hex: c })),
    }));
  } catch {
    return [];
  }
}

function ProductScrollCard({ product }: { product: ProductCard }) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageSrc = isHovered && product.hoverImage ? product.hoverImage : product.image;

  return (
    <article
      className="flex-shrink-0 w-[65vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] max-w-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-zinc-50 aspect-[3/4]">
          {!imgError ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
              <span className="text-xs text-zinc-400">No image</span>
            </div>
          )}
          {product.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest bg-white text-zinc-900">
              {product.badge}
            </span>
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-zinc-900 group-hover:text-zinc-500 transition-colors truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-zinc-700">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-zinc-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 pt-0.5">
              {product.colors.slice(0, 6).map((c, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-zinc-200"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export default function TwoImageGrid() {
  const [image, setImage] = useState<LeftImage | null>(null);
  const [items, setItems] = useState<ProductCard[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLeftImage().then(setImage);
    fetchProducts().then(setItems);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector('article')?.offsetWidth ?? 300;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!image && !items.length) return null;

  return (
    <section className="bg-[#F7F6F3]">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr]">
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[64vh] overflow-hidden min-w-0">
          {image && (
            <Link href={image.link || '#'} className="block w-full h-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-500" />
            </Link>
          )}
        </div>

        <div className="relative min-w-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 sm:px-6 lg:px-8 py-8 md:py-10 items-start"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((product) => (
              <ProductScrollCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
