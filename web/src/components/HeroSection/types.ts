export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  largeImage?: string;
  smallImage?: string;
  videoUrl?: string;
  buttonUrl?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
  position?: string;
}

export interface HeroBannerResponse {
  success: boolean;
  data?: HeroBanner | HeroBanner[];
}
