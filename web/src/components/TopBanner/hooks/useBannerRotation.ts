'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Banner } from '../types';

interface UseBannerRotationOptions {
  banners: Banner[];
  autoRotateInterval?: number;
  enableRotation?: boolean;
}

export function useBannerRotation({
  banners,
  autoRotateInterval = 5000,
  enableRotation = true,
}: UseBannerRotationOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const previous = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < banners.length) {
        setCurrentIndex(index);
      }
    },
    [banners.length],
  );

  useEffect(() => {
    if (!enableRotation || banners.length <= 1) return;

    const interval = setInterval(next, autoRotateInterval);
    return () => clearInterval(interval);
  }, [enableRotation, autoRotateInterval, next, banners.length]);

  return {
    currentBanner: banners[currentIndex],
    currentIndex,
    total: banners.length,
    hasNext: currentIndex < banners.length - 1,
    hasPrev: currentIndex > 0,
    next,
    previous,
    goTo,
  };
}
