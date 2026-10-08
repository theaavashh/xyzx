import type { Category, Prisma } from '@prisma/client';

export interface CategoryFilters {
  isActive?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export type CategoryWithChildren = Category & { children?: CategoryWithChildren[] };

export interface ICategoryRepository {
  findCategories(
    page: number,
    limit: number,
    filters?: CategoryFilters
  ): Promise<PaginatedResult<Category>>;

  findCategoriesWithHierarchy(): Promise<CategoryWithChildren[]>;

  findCategoryById(id: string): Promise<Category | null>;

  findCategoryBySlug(slug: string): Promise<Category | null>;

  createCategory(data: Prisma.CategoryCreateInput): Promise<Category>;

  updateCategory(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;

  deleteCategory(id: string): Promise<void>;

  existsBySlug(slug: string): Promise<boolean>;

  existsById(id: string): Promise<boolean>;

  hasChildren(id: string): Promise<boolean>;

  hasProducts(id: string): Promise<boolean>;
}

export const CATEGORY_REPOSITORY_TOKEN = 'CATEGORY_REPOSITORY';