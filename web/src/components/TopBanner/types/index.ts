export interface Banner {
  id: string;
  title: string;
  isActive: boolean;
  position: string;
  backgroundColor?: string;
  textColor?: string;
  endDate?: string;
  buttonText?: string;
  buttonUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerResponse {
  success: boolean;
  data?: Banner[];
  message?: string;
  errors?: unknown[];
  pagination?: BannerPagination;
}

export interface BannerPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface BannerMetadata {
  other: {
    'announcement-banner': string;
  };
}


