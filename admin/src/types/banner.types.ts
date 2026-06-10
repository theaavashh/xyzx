export interface Banner {
  id: string;
  title: string;
  isActive: boolean;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerFormData {
  title: string;
  isActive: boolean;
}

export interface BannerResponse {
  success: boolean;
  data: Banner[];
  message: string;
}

export interface BannerSingleResponse {
  success: boolean;
  data: Banner;
  message: string;
}
