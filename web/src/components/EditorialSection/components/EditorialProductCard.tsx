'use client';

import { memo, useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '../types';
import { QuickAddBottomSheet } from './QuickAddBottomSheet';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

function resolveImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `${API_BASE_URL}${url}`;
}

interface EditorialProductCardProps {
  product: Product;
}

export const EditorialProductCard = memo(function EditorialProductCard({
  product,
}: EditorialProductCardProps) {
  const allImages = [product.image, ...(product.images ?? [])].filter(Boolean);
  const [imgIndex, setImgIndex] = useState(0);
  const currentSrc = resolveImageUrl(allImages[imgIndex]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const goNext = useCallback(() => {
    setImgIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const goPrev = useCallback(() => {
    setImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  return (
    <article className="flex-shrink-0 w-72 group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="overflow-hidden transition-all duration-300 bg-white rounded-sm">
          <div
            className="relative h-80 overflow-hidden bg-gray-100 rounded-sm select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {currentSrc ? (
              <Image
                key={imgIndex}
                src={currentSrc}
                alt={`${product.name} - ${product.category}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                sizes="288px"
                draggable={false}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-zinc-400 text-sm">Image unavailable</span>
              </div>
            )}

            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); goPrev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/80 shadow hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); goNext(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/80 shadow hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => { e.preventDefault(); setImgIndex(i); }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white w-3' : 'bg-white/60'}`}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-4 text-center">
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center justify-center gap-1 mb-2">
                {product.colors.map((color, i) => (
                  <span
                    key={i}
                    className="w-4 h-3 border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}

            <h3 className="font-semibold text-zinc-900 text-base leading-tight mb-1.5 line-clamp-1">
              {product.name}
            </h3>

            <div className="flex items-baseline justify-center gap-2 mb-3">
              <span className="text-lg font-bold text-zinc-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-zinc-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setQuickAddOpen(true); }}
              className="w-full py-2 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>

      <QuickAddBottomSheet
        product={product}
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </article>
  );
});
