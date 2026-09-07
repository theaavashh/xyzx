import type { FooterSectionData } from '../types';

export async function fetchFooterSections(): Promise<FooterSectionData[]> {
  try {
    const response = await fetch('/api/v1/public/footer-section/active');

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (data.success && data.data) {
      return data.data;
    }

    return [];
  } catch {
    return [];
  }
}
