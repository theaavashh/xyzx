import type { Slide } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchHeroSlides(): Promise<Slide[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/hero-slides/active`,
      {
        next: { revalidate: 60, tags: ['hero-slides'] },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.success || !data.data || data.data.length === 0) return [];

    return data.data.map((item: any) => ({
      title: item.title,
      subtitle: item.subtitle || '',
      image: item.image,
      imageMobile: item.imageMobile || undefined,
      alt: item.alt || item.title,
    }));
  } catch {
    return [];
  }
}
