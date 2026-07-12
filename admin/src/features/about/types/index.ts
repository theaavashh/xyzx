export interface AboutSection {
  id: string;
  quote: string;
  ctaText: string;
  ctaUrl: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AboutSectionFormData {
  quote: string;
  ctaText: string;
  ctaUrl: string;
  isActive: boolean;
}

export const EMPTY_FORM: AboutSectionFormData = {
  quote: '',
  ctaText: 'More About Us',
  ctaUrl: '/about',
  isActive: true,
};
