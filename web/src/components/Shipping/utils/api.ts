import type { ShippingContent } from '../types';

export async function fetchShippingContent(): Promise<ShippingContent | null> {
  try {
    const response = await fetch('/api/v1/shipping/public');
    if (!response.ok) return null;
    const json = await response.json();
    if (!json.success || !json.data) return null;
    const d = json.data;
    const items = d.items || {};
    const settings = d.settings || {};
    return {
      methods: items.methods || [],
      info: items.info || [],
      regions: items.regions || [],
      freeShippingThreshold: settings.freeShippingThreshold || '$100',
      freeInternationalThreshold: settings.freeInternationalThreshold || '$200',
      heroTitle: settings.heroTitle || 'Shipping',
      heroSubtitle: settings.heroSubtitle || 'Fast, reliable delivery worldwide',
    };
  } catch {
    return null;
  }
}
