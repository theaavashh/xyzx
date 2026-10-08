import type { Prisma } from '@prisma/client';
import type { Product } from '@prisma/client';

export interface ProductFilters {
  search?: string;
  slug?: string;
  categoryId?: string;
  categorySlug?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  isNewSeller?: boolean;
  isFestivalOffer?: boolean;
  isDigital?: boolean;
  brandId?: string;
  gender?: string;
}

export interface ProductSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export type ProductWithCategory = Product & {
  category: { id: string; name: string; slug: string };
};

export interface IProductRepository {
  findProducts(
    page: number,
    limit: number,
    filters: ProductFilters,
    sortOptions: ProductSortOptions
  ): Promise<PaginatedResult<ProductWithCategory>>;

  findProductById(id: string): Promise<ProductWithCategory | null>;

  findProductBySlug(slug: string): Promise<ProductWithCategory | null>;

  createProduct(data: Prisma.ProductCreateInput): Promise<ProductWithCategory>;

  updateProduct(id: string, data: Prisma.ProductUpdateInput): Promise<ProductWithCategory>;

  deleteProduct(id: string): Promise<void>;

  bulkDeleteProducts(ids: string[]): Promise<number>;

  existsBySlug(slug: string): Promise<boolean>;

  existsById(id: string): Promise<boolean>;
}

export const PRODUCT_REPOSITORY_TOKEN = 'PRODUCT_REPOSITORY';