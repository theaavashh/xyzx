"use client";

import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  index: number;
  priority?: boolean;
  maxRetries?: number;
}

export const CategoryCard = memo(function CategoryCard({
  category,
  index,
  priority = false,
  maxRetries = 3,
}: CategoryCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    if (retryCount < maxRetries - 1) {
      setRetryCount((prev) => prev + 1);
      setRetryKey((prev) => prev + 1);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  }, [retryCount, maxRetries]);

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setIsLoading(true);
    setHasError(false);
    setRetryKey((prev) => prev + 1);
  }, []);

  const href = category.link || `/products`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex-shrink-0 w-[60vw] sm:w-auto snap-start"
      aria-label={`Shop ${category.title}`}
    >
      <div className="overflow-hidden h-96 relative">
        {!category.image ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{category.title}</p>
          </div>
        ) : hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-2">{category.title}</p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleRetry();
              }}
              className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              Retry ({retryCount}/{maxRetries})
            </button>
            <span className="sr-only">
              Failed to load image for {category.title}
            </span>
          </div>
        ) : (
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <Image
              key={`${category.image}-${retryKey}`}
              src={category.image}
              alt={category.title}
              fill
              priority={priority}
              unoptimized
              className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(max-width: 768px) 60vw, (max-width: 1024px) 33vw, 16vw"
              onLoad={handleLoad}
              onError={handleError}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white tracking-wide drop-shadow-lg">
                {category.title}
              </h3>
            </div>
          </>
        )}
      </div>
    </Link>
  );
});
