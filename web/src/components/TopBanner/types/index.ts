export interface Banner {
  id: string;
  title: string;
  isActive: boolean;
  position: string;
  backgroundColor?: string;
  textColor?: string;
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

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'default-1',
    title: 'Free Shipping on orders over $400!',
    isActive: true,
    position: 'top',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-2',
    title: 'New arrivals available now - Shop the collection',
    isActive: true,
    position: 'top',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-3',
    title: 'Limited time offer - Up to 30% off selected items',
    isActive: true,
    position: 'top',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
