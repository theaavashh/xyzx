'use client';

import { memo, useRef } from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
}

export const ProductCarousel = memo(function ProductCarousel({
  products,
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <section
        ref={scrollContainerRef}
        className="flex gap-4 pb-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-16"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        aria-label="New arrivals products carousel"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            priority={index < 3}
          />
        ))}
      </section>
    </div>
  );
});
