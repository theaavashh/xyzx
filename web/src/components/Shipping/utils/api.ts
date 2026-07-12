import type { ShippingContent } from '../types';

export async function fetchShippingContent(): Promise<ShippingContent | null> {
  try {
    const response = await fetch('/api/v1/public/shipping');
    if (!response.ok) return null;
    const json = await response.json();
    if (!json.success || !json.data) return null;
    const d = json.data;
    return {
      methods: d.methods || [],
      info: d.info || [],
      regions: d.regions || [],
      freeShippingThreshold: d.freeShippingThreshold || '$100',
      freeInternationalThreshold: d.freeInternationalThreshold || '$200',
      heroTitle: d.heroTitle || 'Shipping',
      heroSubtitle: d.heroSubtitle || 'Fast, reliable delivery worldwide',
    };
  } catch {
    return null;
  }
}
