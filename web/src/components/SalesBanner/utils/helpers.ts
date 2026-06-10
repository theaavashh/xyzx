import type { SalesBanner } from '../types';

export function createSalesBannerJsonLd(banner: SalesBanner) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AdvertiserContentArticle',
    headline: banner.title,
    description: banner.subtitle || '',
    image: {
      '@type': 'ImageObject',
      url: banner.image,
      width: 1920,
      height: 1080,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}${banner.buttonUrl}`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_SITE_URL}${banner.buttonUrl}`,
      query: banner.title,
    },
  };
}
