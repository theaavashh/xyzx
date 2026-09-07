'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import { Eye } from 'lucide-react';
import type { NewInProduct } from '../types';

interface NewInCardProps {
  product: NewInProduct;
  priority?: boolean;
}

export const NewInCard = memo(function NewInCard({
  product,
  priority = false,
}: NewInCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <Link href={product.category?.slug ? `/products/${product.category.slug}/${product.slug || product.id}` : `/products/all/${product.slug || product.id}`} className="block">
          <div className="relative overflow-hidden bg-gray-50 aspect-[4/5] sm:aspect-[3/4] group/image">
            {!imgError ? (
              <>
                <Image
                  src={isHovered && product.hoverImage ? product.hoverImage : product.image}
                  alt={product.name}
                  fill
                  priority={priority}
                  className="object-cover transition-opacity duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 22vw"
                  onError={() => setImgError(true)}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-xs text-zinc-600">No image</span>
              </div>
            )}

            {product.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest bg-white text-zinc-600">
                {product.badge}
              </span>
            )}


          </div>

        <div className="mt-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-medium text-zinc-600 truncate">
              {product.name}
            </h3>
            <span className="text-lg font-medium text-zinc-900">
              ${product.price.toFixed(2)}
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-zinc-400 font-normal line-through ml-2">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-xs font-semibold text-red-600">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </span>
          </div>

          {(() => {
            const colorCount = product.colors?.length ?? 0;
            const patternCount = product.patterns?.length ?? 0;
            const total = colorCount + patternCount;
            if (total === 0) return null;
            return (
              <span className="text-xs text-zinc-500 pt-0.5">
                {total} {total === 1 ? 'Color' : 'Colors'}
              </span>
            );
          })()}
        </div>
      </Link>
    </article>
  );
});
