

export interface ProductImage {
  id?: string;
  src: string;
  alt?: string;
}

export interface EditorialImage {
  id: string;
  src: string;
  alt: string;
  link?: string;
}

export interface EditorialSection {
  id: string;
  season: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  images: EditorialImage[];
  featureType?: string;
  productIds?: string[];
  isActive: boolean;
  order: number;
}

export interface ProductItem {
  id: string;
  name: string;
  thumbnail?: string;
  images?: string[] | ProductImage[];
  slug: string;
}

export interface EditorialSectionFormData {
  season: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  featureType: string;
  isActive: boolean;
}

export const FEATURE_OPTIONS = [
  { value: 'isFeatured', label: 'Featured Products' },
  { value: 'isNew', label: 'New Arrivals' },
  { value: 'isOnSale', label: 'Sale / On Sale' },
  { value: 'isBestSeller', label: 'Best Sellers' },
  { value: 'isNewSeller', label: 'New Sellers' },
  { value: 'isFestivalOffer', label: 'Festival Offers' },
] as const;

export const FEATURE_LABELS: Record<string, string> = {
  isFeatured: 'Featured',
  isNew: 'New Arrivals',
  isOnSale: 'On Sale',
  isBestSeller: 'Best Sellers',
  isNewSeller: 'New Sellers',
  isFestivalOffer: 'Festival Offers',
};


