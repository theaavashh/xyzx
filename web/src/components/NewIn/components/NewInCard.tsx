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
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative overflow-hidden bg-gray-50 aspect-[3/4] group/image">
            {!imgError ? (
              <>
                <Image
                  src={isHovered && product.hoverImage ? product.hoverImage : product.image}
                  alt={product.name}
                  fill
                  priority={priority}
                  className="object-cover transition-opacity duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  onError={() => setImgError(true)}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-xs text-gray-400">No image</span>
              </div>
            )}

            {product.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest bg-white text-black">
                {product.badge}
              </span>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="opacity-0 group-hover/image:opacity-100 translate-y-2 group-hover/image:translate-y-0 transition-all duration-300 bg-white text-black text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-sm shadow-md hover:bg-gray-100 flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" />
                Quick View
              </button>
            </div>
          </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-500 transition-colors truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-gray-700">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
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
                  className="w-3 h-3 rounded-full border border-gray-200"
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
});
