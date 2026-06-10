'use client';

import type { Banner } from '../types';
import { SITE_URL } from '../utils/constants';
import { createJsonLdSchema, sanitizeBannerTitle } from '../utils/helpers';

interface TopBannerContentProps {
  banner: Banner;
}

export function TopBannerContent({ banner }: TopBannerContentProps) {
  const safeTitle = sanitizeBannerTitle(banner.title);

  return (
    <>
      <p
        className="text-base sm:text-lg font-medium text-center tracking-tight"
        itemProp="description"
      >
        {safeTitle}
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createJsonLdSchema(banner, SITE_URL)),
        }}
      />
    </>
  );
}
