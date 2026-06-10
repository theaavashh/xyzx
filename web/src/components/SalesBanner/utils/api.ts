import { getApiBaseUrl } from '@/utils/api';
import type { SalesBanner, SalesBannerResponse } from '../types';

export async function fetchSalesBanner(): Promise<SalesBanner | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(
      `${baseUrl}/api/v1/public/sales-banners/active`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data: SalesBannerResponse = await response.json();

    if (data.success && data.data && data.data.length > 0) {
      return data.data[0] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}
