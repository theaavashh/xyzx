export interface Banner {
  id: string;
  title: string;
  isActive: boolean;
  position: string;
  endDate: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BannerFormData {
  title: string;
  isActive: boolean;
  endDate?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
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
