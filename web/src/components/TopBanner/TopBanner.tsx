'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { Banner } from './types';
import { TopBannerStatic } from './components/TopBannerStatic';
import { TopBannerCarousel } from './components/TopBannerCarousel';
import { TopBannerSkeleton } from './skeleton/TopBannerSkeleton';
import { useBannerHeight } from '@/contexts/BannerHeightContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export default function TopBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const bannerRef = useRef<HTMLElement | null>(null);
  const { setBannerHeight } = useBannerHeight();

  const measureHeight = useCallback(() => {
    if (bannerRef.current) {
      setBannerHeight(bannerRef.current.getBoundingClientRect().height);
    }
  }, [setBannerHeight]);

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

  useEffect(() => {
    measureHeight();
    window.addEventListener('resize', measureHeight);
    return () => window.removeEventListener('resize', measureHeight);
  }, [measureHeight, loading]);

  if (loading) return <TopBannerSkeleton />;
  if (banners.length === 0) return null;

  if (banners.length === 1) {
    return <TopBannerStatic ref={bannerRef} banner={banners[0]} />;
  }

  return <TopBannerCarousel ref={bannerRef} banners={banners} enableRotation autoRotateInterval={5000} />;
}
