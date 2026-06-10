"use client";

import { useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { EditorialProductCard } from './components';
import type { Product } from './types';

interface EditorialSectionClientProps {
  season: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  products: Product[];
}

export function EditorialSectionClient({
  season,
  title,
  description,
  ctaText,
  ctaLink,
  products,
}: EditorialSectionClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStart.current = { x: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = dragStart.current.scrollLeft - (x - dragStart.current.x);
  }, [isDragging]);

  const onMouseUp = useCallback(() => setIsDragging(false), []);
  const onMouseLeave = useCallback(() => setIsDragging(false), []);

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center lg:text-left max-w-2xl mb-10 lg:mb-14 mx-auto lg:mx-0">
          <p className="text-sm font-semibold tracking-[0.3em] text-[#D4AF37] uppercase mb-3">
            {season}
          </p>
          <h2 className={`lastik text-4xl sm:text-5xl lg:text-6xl text-zinc-900 leading-tight mb-4`}>
            {title}
          </h2>
          {description && (
            <p className="text-base sm:text-lg text-zinc-500 leading-relaxed">
              {description}
            </p>
          )}

          {ctaText && ctaLink && (
            <div className="mt-6 lg:mt-8">
              <Link
                href={ctaLink}
                className="bg-transparent text-[#D4AF37] underline text-sm font-bold tracking-wider uppercase transition-opacity duration-300 hover:opacity-70 inline-block"
              >
                {ctaText}
              </Link>
            </div>
          )}
        </div>

        {products.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className={`flex gap-3 md:gap-5 pb-4 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            {products.map((product) => (
              <EditorialProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">No Product Available</p>
          </div>
        )}
      </div>
    </section>
  );
}
