'use client';

import type { Banner } from '../types';
import { SITE_URL } from '../utils/constants';
import { createJsonLdSchema, sanitizeBannerTitle } from '../utils/helpers';
import { CountdownTimer } from './CountdownTimer';

interface TopBannerContentProps {
  banner: Banner;
}

export function TopBannerContent({ banner }: TopBannerContentProps) {
  const safeTitle = sanitizeBannerTitle(banner.title);
  const showCountdown = !!banner.endDate;
  const showButton = !!banner.buttonText && !!banner.buttonUrl;

  return (
    <>
      <div className="w-full flex flex-col items-center gap-1 lg:flex-row lg:justify-between lg:items-center">
        {showCountdown && (
          <div className="lg:flex-shrink-0">
            <CountdownTimer endDate={banner.endDate!} textColor={banner.textColor} />
          </div>
        )}

        <p
          className="text-sm sm:text-sm lg:text-base font-medium tracking-wide text-center lg:flex-1"
          itemProp="description"
        >
          {safeTitle}
        </p>

        {showButton && (
          <a
            href={banner.buttonUrl!}
            className="lg:flex-shrink-0 text-xs sm:text-sm font-bold tracking-widest uppercase hover:opacity-60 transition-opacity duration-200 whitespace-nowrap"
            style={{ color: banner.textColor }}
          >
            {banner.buttonText}
          </a>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createJsonLdSchema(banner, SITE_URL)),
        }}
      />
    </>
  );
}
