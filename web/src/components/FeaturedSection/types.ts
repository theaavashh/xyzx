export interface FeaturedSection {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaUrl?: string;
  ctaText?: string;
  isActive: boolean;
  order: number;
}

export interface FeaturedSectionResponse {
  success: boolean;
  data?: FeaturedSection[];
}
