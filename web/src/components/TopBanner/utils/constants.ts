export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://rapharch.com';

export const BANNER_REVALIDATE_INTERVAL = process.env.NODE_ENV === 'development' ? 0 : 60;

export const BANNER_FETCH_OPTIONS = {
  revalidate: BANNER_REVALIDATE_INTERVAL,
  tags: ['banners'],
} as const;

export const DEFAULT_BANNER_BG_COLOR = '#C6E2E7';
export const DEFAULT_BANNER_TEXT_COLOR = '#1F2937';
