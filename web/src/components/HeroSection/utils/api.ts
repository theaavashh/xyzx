import type { HeroBanner, HeroBannerResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchHeroBanner(): Promise<HeroBanner[] | null> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/public/hero-banners/active`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) return null;

    const json: HeroBannerResponse = await response.json();

    if (!json.success || !json.data) return null;

    const data = json.data;
    const banners = Array.isArray(data) ? data : [data];

    const activeBanners = banners.filter((b) => b.isActive !== false);

    if (activeBanners.length === 0) return null;

    return activeBanners;
  } catch {
    return null;
  }
}
