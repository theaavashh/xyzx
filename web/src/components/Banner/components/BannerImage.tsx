"use client";

import Image from 'next/image';
import { memo, useCallback, useState } from 'react';

interface BannerImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  maxRetries?: number;
}

export const BannerImage = memo(function BannerImage({
  src,
  alt,
  priority = false,
  maxRetries = 3,
}: BannerImageProps) {
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

  return (
    <div className="relative w-full h-full overflow-hidden">
      {hasError ? (
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
          <p className="text-sm text-gray-500 mb-2">{alt}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            Retry ({retryCount}/{maxRetries})
          </button>
          <span className="sr-only">Failed to load banner image</span>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <Image
            key={`${src}-${retryKey}`}
            src={src}
            alt={alt}
            fill
            priority={priority}
            placeholder="empty"
            quality={75}
            className={`object-contain transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="100vw"
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
          />
        </>
      )}
    </div>
  );
});
