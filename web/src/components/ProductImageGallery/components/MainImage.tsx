import Image from 'next/image';
import { memo } from 'react';

interface MainImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackText?: string;
  retryCount?: number;
  onRetry?: () => void;
  quality?: number;
}

export const MainImage = memo(function MainImage({
  src,
  alt,
  priority = false,
  isLoading = false,
  hasError = false,
  onLoad,
  onError,
  fallbackText,
  retryCount = 0,
  onRetry,
  quality = 75,
}: MainImageProps) {
  return (
    <div className="flex-1 aspect-square lg:aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative group max-h-[800px] lg:max-w-[800px]">
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center p-4">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
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
            <p className="text-sm text-gray-500">
              {fallbackText || 'Image unavailable'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Retried {retryCount} times
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-2 px-3 py-1 text-xs bg-gray-300 hover:bg-gray-400 rounded transition-colors"
              >
                Retry
              </button>
            )}
            <span className="sr-only">Failed to load image</span>
          </div>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <Image
            key={`${src}-${retryCount}`}
            src={src}
            alt={alt}
            fill
            priority={priority}
            placeholder="empty"
            quality={quality}
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoad={onLoad}
            onError={onError}
            loading={priority ? 'eager' : 'lazy'}
          />
        </>
      )}
    </div>
  );
});
