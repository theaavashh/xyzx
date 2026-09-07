import type { Banner, BannerResponse } from '../types';
import { BANNER_REVALIDATE_INTERVAL } from './constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchBanners(): Promise<Banner[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/banners/active`,
      {
        next: {
          revalidate: BANNER_REVALIDATE_INTERVAL,
          tags: ['banners'],
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data: BannerResponse = await response.json();

    if (!data.success || !data.data || data.data.length === 0) {
      return [];
    }

    return data.data;
  } catch {
    return [];
  }
}

export async function fetchBannerMetadata(): Promise<{
  other: { 'announcement-banner': string };
}> {
  try {
    const banners = await fetchBanners();
    const bannerText = banners.map((b) => b.title).join(' | ');

    return {
      other: {
        'announcement-banner': bannerText,
      },
    };
  } catch {
    return { other: { 'announcement-banner': '' } };
  }
}
