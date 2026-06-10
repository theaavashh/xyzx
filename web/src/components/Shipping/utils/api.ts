import type { ShippingContent } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchShippingContent(): Promise<ShippingContent | null> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/shipping/public`);
    if (!response.ok) return null;
    const json = await response.json();
    if (!json.data) return null;
    const { items, settings } = json.data;
    return {
      methods: items?.methods || [],
      info: items?.info || [],
      regions: items?.regions || [],
      freeShippingThreshold: settings?.freeShippingThreshold || '$100',
      freeInternationalThreshold: settings?.freeInternationalThreshold || '$200',
      heroTitle: settings?.heroTitle || 'Shipping',
      heroSubtitle: settings?.heroSubtitle || 'Fast, reliable delivery worldwide',
    };
  } catch {
    return null;
  }
}
