'use client';

import { memo } from 'react';

interface SalesBannerSkeletonProps {
  className?: string;
}

export const SalesBannerSkeleton = memo(function SalesBannerSkeleton({
  className = '',
}: SalesBannerSkeletonProps) {
  return (
    <div
      className={`relative w-full min-h-[600px] bg-white ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite linear',
        }}
      />
    </div>
  );
});
