import type { Metadata } from 'next';
import { TopBannerCarousel, TopBannerStatic } from './components';
import { fetchBanners } from './utils/api';

interface TopBannerProps {
  autoRotateInterval?: number;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const banners = await fetchBanners();
    const bannerText = banners.map((b) => b.title).join(' | ');

    return {
      other: {
        'announcement-banner': bannerText,
      },
    };
  } catch {
    return {
      other: {
        'announcement-banner': '',
      },
    };
  }
}

export default async function TopBanner({
  autoRotateInterval = 5000,
}: TopBannerProps) {
  try {
    const banners = await fetchBanners();

    if (!banners || banners.length === 0) {
      return null;
    }

    if (banners.length > 1) {
      return (
        <TopBannerCarousel
          banners={banners}
          enableRotation={true}
          autoRotateInterval={autoRotateInterval}
        />
      );
    }

    const firstBanner = banners.at(0);
    if (!firstBanner) return null;

    return <TopBannerStatic banner={firstBanner} />;
  } catch {
    return null;
  }
}

export type { Banner, BannerResponse } from './types';
export { fetchBannerMetadata, fetchBanners } from './utils/api';
