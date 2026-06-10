export interface EditorialImage {
  id: string;
  src: string;
  alt: string;
  link?: string;
}

export interface EditorialSectionData {
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

export interface EditorialResponse {
  success: boolean;
  data?: EditorialSectionData[];
}

export interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  isNew: boolean;
  badge: string;
  colors?: string[];
  sizes?: string[];
  colorOptions?: string[];
}
