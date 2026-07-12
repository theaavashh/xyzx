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
      <div className="w-full flex flex-col items-center sm:flex-row sm:justify-center lg:grid lg:grid-cols-3 gap-2 sm:gap-4">
        {showCountdown && (
          <div className="lg:justify-self-start">
            <CountdownTimer endDate={banner.endDate!} textColor={banner.textColor} />
          </div>
        )}

        <p
          className="text-lg sm:text-xl font-semibold tracking-tight text-center sm:text-left lg:text-center"
          itemProp="description"
        >
          {safeTitle}
        </p>

        {showButton && (
          <a
            href={banner.buttonUrl!}
            className="hidden sm:inline-block lg:justify-self-end text-sm font-bold tracking-widest uppercase hover:opacity-60 transition-opacity duration-200 whitespace-nowrap"
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
