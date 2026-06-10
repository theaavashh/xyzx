'use client';

import { memo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { SalesBanner } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

function resolveImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `${API_BASE}${url}`;
}

export default memo(function SalesBanner() {
  const [banner, setBanner] = useState<SalesBanner | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/public/sales-banners/active`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          setBanner(data.data[0]);
        }
      })
      .catch(() => {});
  }, []);

  if (!banner) return null;

  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src={resolveImageUrl(banner.image)}
          alt={banner.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 flex items-center min-h-[500px] md:min-h-[600px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.3em] text-[#D4AF37] uppercase mb-3">
            {banner.subtitle || 'Featured'}
          </p>
          <h2 className="lastik text-4xl sm:text-5xl lg:text-7xl text-white leading-tight mb-4">
            {banner.title}
          </h2>
          {banner.buttonText && banner.buttonUrl && (
            <Link
              href={banner.buttonUrl}
              className="rounded-sm bg-[#D4AF37] px-8 py-3.5 text-sm font-bold tracking-wider text-black uppercase transition-all duration-300 hover:bg-[#c9a32e] hover:shadow-lg active:scale-95 inline-block"
            >
              {banner.buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
});

export type { SalesBanner } from './types';
