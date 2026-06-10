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
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedSectionFormData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaUrl: string;
  ctaText: string;
  isActive: boolean;
}

export const EMPTY_FORM: FeaturedSectionFormData = {
  title: '',
  subtitle: '',
  description: '',
  image: '',
  ctaUrl: '',
  ctaText: '',
  isActive: true,
};
