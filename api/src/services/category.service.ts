import { Prisma } from '@prisma/client';
import type { Category } from '@prisma/client';
import { categoryRepository } from '../repositories/category.repository';

export interface CategoryFilters {
  isActive?: boolean;
}

export interface PaginatedCategories {
  data: Category[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export const getCategories = async (
  page: number,
  limit: number,
  filters: CategoryFilters = {},
): Promise<PaginatedCategories> => {
  return categoryRepository.findCategories(page, limit, filters);
};

export const getCategoriesHierarchy = async (): Promise<Category[]> => {
  return categoryRepository.findCategoriesWithHierarchy();
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  return categoryRepository.findCategoryById(id);
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  return categoryRepository.findCategoryBySlug(slug);
};

const generateSlug = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export const createCategory = async (data: {
  name: string;
  slug?: string;
  image?: string;
  internalLink?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}): Promise<Category> => {
  const finalSlug = data.slug || generateSlug(data.name);

  const slugExists = await categoryRepository.existsBySlug(finalSlug);
  if (slugExists) {
    throw new Error('Category with this slug already exists');
  }

  return categoryRepository.createCategory({
    name: data.name,
    slug: finalSlug,
    image: data.image || undefined,
    internalLink: data.internalLink || undefined,
    isActive: true,
    metaTitle: data.metaTitle || undefined,
    metaDescription: data.metaDescription || undefined,
    keywords: data.keywords || undefined,
  });
};

export const updateCategory = async (
  id: string,
  data: {
    name?: string;
    slug?: string;
    image?: string | null;
    internalLink?: string | null;
    isActive?: boolean;
    metaTitle?: string | null;
    metaDescription?: string | null;
    keywords?: string | null;
  },
): Promise<Category> => {
  const exists = await categoryRepository.existsById(id);
  if (!exists) {
    throw new Error('Category not found');
  }

  const updateSlug = data.slug || (data.name ? generateSlug(data.name) : undefined);

  if (updateSlug) {
    const existingCategory = await categoryRepository.findCategoryById(id);
    if (existingCategory && updateSlug !== existingCategory.slug) {
      const slugExists = await categoryRepository.existsBySlug(updateSlug);
      if (slugExists) {
        throw new Error('Category with this slug already exists');
      }
    }
  }

  const updateData: Prisma.CategoryUpdateInput = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (updateSlug !== undefined) updateData.slug = updateSlug;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.internalLink !== undefined) updateData.internalLink = data.internalLink;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
  if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
  if (data.keywords !== undefined) updateData.keywords = data.keywords;

  return categoryRepository.updateCategory(id, updateData);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const exists = await categoryRepository.existsById(id);
  if (!exists) {
    throw new Error('Category not found');
  }

  const hasSubcategories = await categoryRepository.hasChildren(id);
  if (hasSubcategories) {
    throw new Error('Cannot delete category because it has subcategories. Remove subcategories first.');
  }

  const hasAssociatedProducts = await categoryRepository.hasProducts(id);
  if (hasAssociatedProducts) {
    throw new Error('Cannot delete category because it has associated products. Remove products first.');
  }

  await categoryRepository.deleteCategory(id);
};

export const toggleCategoryStatus = async (id: string): Promise<Category> => {
  const category = await categoryRepository.findCategoryById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  return categoryRepository.updateCategory(id, {
    isActive: !category.isActive,
  });
};

export const categoryService = {
  getCategories,
  getCategoriesHierarchy,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};
