'use client';

import { useEffect, useState } from 'react';
import type { Banner } from './types';
import { TopBannerStatic } from './components/TopBannerStatic';
import { TopBannerCarousel } from './components/TopBannerCarousel';
import { TopBannerSkeleton } from './skeleton/TopBannerSkeleton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999';

export default function TopBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/public/banners/active`, {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });
        if (!res.ok) {
          if (!cancelled) setLoading(false);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setBanners(data.data || []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <TopBannerSkeleton />;
  if (banners.length === 0) return null;

  if (banners.length === 1) {
    return <TopBannerStatic banner={banners[0]} />;
  }

  return <TopBannerCarousel banners={banners} enableRotation autoRotateInterval={5000} />;
}
