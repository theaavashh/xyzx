export interface Category {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  status: 'active' | 'inactive';
  internalLink?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

export interface CategoryApiResponse {
  id: string;
  name: string;
  image?: string;
  createdAt?: string;
  isActive: boolean;
  internalLink?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: CategoryApiResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface CreateCategoryResponse {
  success: boolean;
  data: CategoryApiResponse;
  message?: string;
}

export interface UpdateCategoryResponse {
  success: boolean;
  data: CategoryApiResponse;
  message?: string;
}

export interface DeleteCategoryResponse {
  success: boolean;
  message?: string;
}

export interface UploadImageResponse {
  success: boolean;
  data: {
    url: string;
  };
  message?: string;
}
