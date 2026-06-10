import type { Metadata } from 'next';
import type { Banner } from '../types';

export function createBannerMetadata(banners: Banner[]): Metadata {
  const bannerText = banners.map((b) => b.title).join(' | ');

  return {
    other: {
      'announcement-banner': bannerText,
    },
  };
}

export function createJsonLdSchema(banner: Banner, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPageElement',
    name: 'Top Promotional Banner',
    description: banner.title,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': siteUrl,
    },
  };
}

export function sanitizeBannerTitle(title: string): string {
  return title.replace(/<[^>]*>/g, '').trim();
}

export function isValidBanner(banner: unknown): banner is Banner {
  if (!banner || typeof banner !== 'object') return false;
  const b = banner as Partial<Banner>;
  return (
    typeof b.id === 'string' &&
    typeof b.title === 'string' &&
    typeof b.isActive === 'boolean'
  );
}
