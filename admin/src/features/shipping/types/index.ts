export interface ShippingItem {
  id: string;
  type: 'method' | 'info' | 'region';
  name?: string;
  title?: string;
  region?: string;
  description?: string;
  price?: string;
  time?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingSettings {
  id: string;
  freeShippingThreshold: string;
  freeInternationalThreshold: string;
  heroTitle: string;
  heroSubtitle: string;
}
