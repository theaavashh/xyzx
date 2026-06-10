'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Banner } from '../types';
import { TopBannerContent } from './TopBannerContent';
import { DEFAULT_BANNER_BG_COLOR, DEFAULT_BANNER_TEXT_COLOR } from '../utils/constants';

interface TopBannerStaticProps {
  banner: Banner;
}

export function TopBannerStatic({ banner }: TopBannerStaticProps) {
  return (
    <header
      className="text-gray-800"
      style={{
        backgroundColor: banner.backgroundColor || DEFAULT_BANNER_BG_COLOR,
        color: banner.textColor || DEFAULT_BANNER_TEXT_COLOR,
      }}
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <meta itemProp="name" content="Promotional Banner" />
      <div className="max-w-7xl mx-auto py-1 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-center min-h-[24px] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <TopBannerContent banner={banner} />
        </motion.div>
      </div>
    </header>
  );
}
