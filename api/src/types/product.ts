export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  stock: number;
  categoryId: string;
  brandId?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithCategory extends Product {
  category: ProductCategory;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  isActive: boolean;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductCreateInput {
  name: string;
  slug?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  stock?: number;
  categoryId: string;
  brandId?: string;
  images?: string[];
}

export interface ProductUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  stock?: number;
  categoryId?: string;
  brandId?: string;
  images?: string[];
}