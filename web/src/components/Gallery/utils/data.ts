import type { GalleryItem } from '../types';
import { getApiBaseUrl } from '@/utils/api';

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(
      `${baseUrl}/api/v1/gallery-items?isActive=true`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (data.success && data.data && data.data.length > 0) {
      return data.data
        .filter((item: GalleryItem) => item.isActive !== false)
        .sort((a: GalleryItem, b: GalleryItem) => (a.order ?? 0) - (b.order ?? 0));
    }

    return [];
  } catch {
    return [];
  }
}
