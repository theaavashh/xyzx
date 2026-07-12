export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  imageMobile: string | null;
  alt: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSlideForm {
  title: string;
  subtitle: string;
  image: string;
  imageMobile: string;
  alt: string;
  isActive: boolean;
  order: number;
}
