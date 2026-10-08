'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';
import type { NewInProduct } from '../types';

interface NewInCardProps {
  product: NewInProduct;
  priority?: boolean;
}

function getMinVariantPrice(product: NewInProduct): number {
  if (!product.variants?.length) return product.price;
  const variantPrices = product.variants
    .filter(v => typeof v.price === 'number')
    .map(v => v.price!);
  return variantPrices.length > 0 ? Math.min(...variantPrices) : product.price;
}

function getVariantOriginalPrice(product: NewInProduct): number | null {
  if (!product.variants?.length) return product.originalPrice ?? null;
  const firstVariant = product.variants[0];
  return firstVariant?.discountPrice ?? firstVariant?.comparePrice ?? product.originalPrice ?? null;
}

export const NewInCard = memo(function NewInCard({
  product,
  priority = false,
}: NewInCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const displayPrice = getMinVariantPrice(product);
  const variantOriginalPrice = getVariantOriginalPrice(product);
  const hasDiscount = variantOriginalPrice && variantOriginalPrice > displayPrice;

  return (
    <article
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={product.category?.slug
          ? `/products/${product.category.slug}/${product.slug || product.id}`
          : `/products/all/${product.slug || product.id}`}
        className="block"
      >
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

          {hasDiscount && (
            <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest bg-red-600 text-white">
              -{Math.round((1 - displayPrice / variantOriginalPrice!) * 100)}%
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-zinc-600">
              {product.name}
            </h3>
            <span className="text-lg font-medium text-zinc-900">
              ${displayPrice.toFixed(2)}
              {hasDiscount && (
                <>
                  <span className="text-sm text-zinc-400 font-normal line-through ml-2">
                    ${variantOriginalPrice!.toFixed(2)}
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
