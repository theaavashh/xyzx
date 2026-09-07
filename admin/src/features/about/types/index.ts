export interface AboutSection {
  id: string;
  // Homepage quote
  quote: string;
  ctaText: string;
  ctaUrl: string;
  // Hero
  heroImage: string | null;
  heroSubtitle: string | null;
  heroTagline: string | null;
  // Our Story
  storyTitle: string | null;
  storyContent: string | null;
  storyImage: string | null;
  // Pull quote
  pullQuote: string | null;
  // Video
  videoUrl: string | null;
  videoOverlayText: string | null;
  // Banner
  bannerImage: string | null;
  bannerText: string | null;
  // Store
  storeDescription: string | null;
  storeAddress: string | null;
  storeCity: string | null;
  storeState: string | null;
  storeZip: string | null;
  storePhone: string | null;
  storeEmail: string | null;
  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  // Status
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type AboutSectionFormData = Omit<AboutSection, 'id' | 'createdAt' | 'updatedAt'>;

export const EMPTY_FORM: AboutSectionFormData = {
  quote: '',
  ctaText: 'More About Us',
  ctaUrl: '/about',
  heroImage: '',
  heroSubtitle: '',
  heroTagline: '',
  storyTitle: '',
  storyContent: '',
  storyImage: '',
  pullQuote: '',
  videoUrl: '',
  videoOverlayText: '',
  bannerImage: '',
  bannerText: '',
  storeDescription: '',
  storeAddress: '',
  storeCity: '',
  storeState: '',
  storeZip: '',
  storePhone: '',
  storeEmail: '',
  metaTitle: '',
  metaDescription: '',
  isActive: true,
  order: 0,
};
