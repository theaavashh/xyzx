'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

function resolveImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
}

interface ColorOption {
  name: string;
  hex: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  isNew: boolean;
  badge: string;
  colors?: ColorOption[];
}

interface ProductCardProps {
  product: Product;
  index: number;
  priority?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product,
  index,
  priority = false,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const colors = product.colors || [];
  const imageSrc = resolveImageUrl(product.image);

  return (
    <article
      className="flex-shrink-0 w-96 group"
      itemScope
      itemType="https://schema.org/Product"
      itemProp="itemListElement"
    >
      <meta itemProp="position" content={String(index + 1)} />
      <Link href={`/product/${product.id}`} className="block">
        <div className="overflow-hidden transition-all duration-300 bg-white rounded-lg ">
          <div className="relative h-96 overflow-hidden bg-gray-100 rounded-t-lg">
            {imageSrc && !imageError ? (
              <Image
                src={imageSrc}
                alt={`${product.name} - ${product.category}`}
                fill
                priority={priority}
                className="object-contain transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 320px"
                itemProp="image"
                onError={handleImageError}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-sm">Image unavailable</span>
              </div>
            )}

            {product.badge && (
              <div className="absolute top-4 left-4">
                <span
                  className="px-3 py-1 text-sm font-medium rounded-lg bg-white text-black shadow-md"
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <meta
                    itemProp="availability"
                    content="https://schema.org/InStock"
                  />
                  <meta itemProp="priceCurrency" content="USD" />
                  <meta itemProp="price" content={String(product.price)} />
                  {product.badge}
                </span>
              </div>
            )}

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              <button
                type="button"
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                onClick={handleWishlistClick}
                aria-label={`Add ${product.name} to wishlist`}
              >
                <svg
                  className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-2">
              <h3
                className="font-semibold text-gray-800 text-lg group-hover:text-black transition-colors line-clamp-1"
                itemProp="name"
              >
                {product.name}
              </h3>
              
            </div>

            <div
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
              className="mb-2"
            >
              <meta itemProp="priceCurrency" content="USD" />
              <meta itemProp="price" content={String(product.price)} />
              <meta
                itemProp="availability"
                content="https://schema.org/InStock"
              />
              <span
                className="text-xl font-semibold text-gray-900"
                itemProp="price"
              >
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-2 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>

            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <div className="flex gap-1">
                {colors.slice(0, 4).map((color, idx) => (
                  <span
                    key={`${color.name}-${idx}`}
                    className="w-4 h-4 border border-gray-300 rounded-sm"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                {colors.length > 4 && (
                  <span className="text-xs text-gray-500 ml-1">
                    +{colors.length - 4}
                  </span>
                )}
              </div>

              <div
                className="flex items-center gap-1"
                itemProp="aggregateRating"
                itemScope
                itemType="https://schema.org/AggregateRating"
              >
                <meta itemProp="ratingValue" content={String(product.rating)} />
                <meta
                  itemProp="reviewCount"
                  content={String(product.reviews)}
                />
                <span className="text-amber-500" aria-hidden="true">
                  ★
                </span>
                <span className="text-sm text-gray-700 font-medium">
                  {product.rating}
                </span>
                <span className="text-xs text-gray-500">
                  ({product.reviews})
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
});
