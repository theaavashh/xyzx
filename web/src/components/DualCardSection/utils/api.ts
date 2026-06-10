import type { DualCardSection, DualCardSectionResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchDualCardSections(): Promise<DualCardSection[]> {
  try {
    const response = await fetch(
      `${API_BASE}/api/v1/public/dual-card-sections/active`,
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

    const json: DualCardSectionResponse = await response.json();

    if (!json.success || !json.data) {
      return [];
    }

    return json.data.filter((section) => section.isActive !== false);
  } catch {
    return [];
  }
}
