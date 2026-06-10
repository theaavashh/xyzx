'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { SalesBanner } from '../types';

interface SalesBannerContentProps {
  banner: SalesBanner;
}

export const SalesBannerContent = memo(function SalesBannerContent({
  banner,
}: SalesBannerContentProps) {
  return (
    <div className="text-center max-w-4xl mx-auto text-white">
      {banner.subtitle && (
        <p className="text-lg md:text-xl font-medium tracking-widest uppercase mb-4 opacity-90">
          {banner.subtitle}
        </p>
      )}

      <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
        {banner.title}
      </h2>

      {banner.buttonText && banner.buttonUrl && (
        <Link
          href={banner.buttonUrl}
          className="inline-block bg-white text-black px-10 py-4 text-lg font-semibold rounded-none hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {banner.buttonText}
        </Link>
      )}
    </div>
  );
});
