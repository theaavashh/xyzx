export interface SalesBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesBannerFormData {
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonUrl: string;
  isActive: boolean;
}
