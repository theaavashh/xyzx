'use client';

import React, { memo } from 'react';

interface TopBannerSkeletonProps {
  className?: string;
}

export const TopBannerSkeleton = memo(function TopBannerSkeleton({
  className = '',
}: TopBannerSkeletonProps) {
  return (
    <div
      className={`bg-[#C6E2E7] py-2.5 px-4 animate-pulse ${className}`}
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[40px]">
          <div className="h-5 w-96 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
});

export default TopBannerSkeleton;
