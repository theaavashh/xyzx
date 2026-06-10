import type { VisitOurStoreData } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchVisitOurStore(): Promise<VisitOurStoreData | null> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/store-section/public`);

    if (!response.ok) {
      return null;
    }

    const json = await response.json();

    if (json.data) {
      return json.data;
    }

    return null;
  } catch {
    return null;
  }
}
