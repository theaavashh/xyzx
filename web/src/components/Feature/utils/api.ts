import type { FeatureData } from '../types';

export async function fetchFeature(): Promise<FeatureData | null> {
  try {
    const response = await fetch('/api/v1/public/follow-section/active');

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.success && data.data) {
      return data.data;
    }

    return null;
  } catch {
    return null;
  }
}
