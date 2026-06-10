export interface StoreHours {
  days: string;
  hours: string;
  isActive: boolean;
}

export interface VisitOurStoreData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  image: string;
  mapEmbedUrl: string;
  ctaText: string;
  ctaUrl: string;
  hours: StoreHours[];
  isActive: boolean;
}

export interface StoreLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
