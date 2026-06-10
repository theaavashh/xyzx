'use client';

import { memo, useEffect, useState } from 'react';
import Image from 'next/image';

interface SalesBannerImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

const MAX_RETRIES = 3;

export const SalesBannerImage = memo(function SalesBannerImage({
  src,
  alt,
  priority = true,
}: SalesBannerImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (retryCount > 0 && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        setHasError(false);
        setIsLoading(true);
      }, 1000 * retryCount);
      return () => clearTimeout(timer);
    }
  }, [retryCount]);

  const handleError = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount((prev) => prev + 1);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        sizes="100vw"
        quality={90}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
    </div>
  );
});
