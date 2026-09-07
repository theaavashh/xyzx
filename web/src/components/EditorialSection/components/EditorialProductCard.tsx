'use client';

import { memo, useState } from 'react';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '../types';

interface EditorialProductCardProps {
  product: Product;
}

export const EditorialProductCard = memo(function EditorialProductCard({
  product,
}: EditorialProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
          {!imgError ? (
            <Image
              src={product.image}
              alt={`${product.name} - ${product.category}`}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
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

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-zinc-600 text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-sm shadow-md hover:bg-gray-100 flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-zinc-600 group-hover:text-zinc-600 transition-colors truncate">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-zinc-600">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-zinc-600 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 pt-0.5">
              {product.colors.slice(0, 6).map((color, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={typeof color === 'string' ? color : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
});
