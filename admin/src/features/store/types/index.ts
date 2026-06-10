export interface StoreHours {
  days: string;
  hours: string;
  isActive?: boolean;
}

export interface StoreSection {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
  image?: string;
  mapEmbedUrl?: string;
  ctaText: string;
  ctaUrl: string;
  hours: StoreHours[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
