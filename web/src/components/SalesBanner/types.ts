export interface SalesBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  buttonText?: string | null;
  buttonUrl?: string | null;
  isActive: boolean;
  order: number;
}

export interface SalesBannerResponse {
  success: boolean;
  data: SalesBanner[];
  message?: string;
}
