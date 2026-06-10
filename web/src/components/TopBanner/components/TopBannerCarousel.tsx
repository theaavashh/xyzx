'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useBannerRotation } from '../hooks';
import type { Banner } from '../types';
import { TopBannerContent } from './TopBannerContent';
import { DEFAULT_BANNER_BG_COLOR, DEFAULT_BANNER_TEXT_COLOR } from '../utils/constants';

interface TopBannerCarouselProps {
  banners: Banner[];
  enableRotation?: boolean;
  autoRotateInterval?: number;
}

export function TopBannerCarousel({
  banners,
  enableRotation = false,
  autoRotateInterval = 5000,
}: TopBannerCarouselProps) {
  const { currentBanner, next, previous, goTo, currentIndex } =
    useBannerRotation({
      banners,
      enableRotation,
      autoRotateInterval,
    });

  if (!currentBanner) return null;

  return (
    <div
      className="text-gray-800 relative"
      style={{
        backgroundColor: currentBanner.backgroundColor || DEFAULT_BANNER_BG_COLOR,
        color: currentBanner.textColor || DEFAULT_BANNER_TEXT_COLOR,
      }}
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <meta itemProp="name" content="Promotional Banner" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner.id}
            className="flex items-center justify-center min-h-[24px] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <TopBannerContent banner={currentBanner} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
