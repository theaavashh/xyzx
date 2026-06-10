import type { FeaturedSection, FeaturedSectionResponse } from '../types';

export async function fetchFeaturedSections(): Promise<FeaturedSection[]> {
  try {
    const response = await fetch('/api/v1/public/featured-sections/active', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const json: FeaturedSectionResponse = await response.json();

    if (!json.success || !json.data) {
      return [];
    }

    return json.data
      .filter((section) => section.isActive !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch {
    return [];
  }
}
