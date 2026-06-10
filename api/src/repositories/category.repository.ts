import type { Category, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

export interface CategoryFilters {
  isActive?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

type CategoryWithChildren = Category & { children?: CategoryWithChildren[] };

const CACHE_PREFIX = 'category';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (
  filters: CategoryFilters,
): Prisma.CategoryWhereInput => {
  const where: Prisma.CategoryWhereInput = {};
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  return where;
};

const invalidateCache = async (): Promise<void> => {
  await Promise.all([
    cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:hierarchy*`),
  ]);
};

export const findCategories = async (
  page: number,
  limit: number,
  filters: CategoryFilters = {},
): Promise<PaginatedResult<Category>> => {
  const cacheKey = getCacheKey(
    `list:${page}:${limit}:${JSON.stringify(filters)}`,
  );

  return cacheService.getOrSet(cacheKey, async () => {
    const where = buildWhereClause(filters);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.category.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  });
};

export const findCategoriesWithHierarchy = async (): Promise<
  CategoryWithChildren[]
> => {
  const cacheKey = getCacheKey('hierarchy');

  return cacheService.getOrSet(cacheKey, async () => {
    const allCategories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    const categoryMap = new Map<string, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    for (const cat of allCategories) {
      categoryMap.set(cat.id, { ...cat, children: [] });
    }
    for (const cat of allCategories) {
      const categoryWithChildren = categoryMap.get(cat.id)!;
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) parent.children!.push(categoryWithChildren);
      } else {
        rootCategories.push(categoryWithChildren);
      }
    }

    return rootCategories;
  });
};

export const findCategoryById = async (
  id: string,
): Promise<Category | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.category.findUnique({ where: { id } }),
  );
};

export const findCategoryBySlug = async (
  slug: string,
): Promise<Category | null> => {
  const cacheKey = getCacheKey(`slug:${slug}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.category.findUnique({ where: { slug } }),
  );
};

export const createCategory = async (
  data: Prisma.CategoryCreateInput,
): Promise<Category> => {
  const category = await prisma.category.create({ data });
  await invalidateCache();
  return category;
};

export const updateCategory = async (
  id: string,
  data: Prisma.CategoryUpdateInput,
): Promise<Category> => {
  const category = await prisma.category.update({ where: { id }, data });
  await invalidateCache();
  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await prisma.category.delete({ where: { id } });
  await invalidateCache();
};

export const existsBySlug = async (slug: string): Promise<boolean> => {
  const count = await prisma.category.count({ where: { slug } });
  return count > 0;
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.category.count({ where: { id } });
  return count > 0;
};

export const hasChildren = async (id: string): Promise<boolean> => {
  const count = await prisma.category.count({
    where: { parentId: id },
  });
  return count > 0;
};

export const hasProducts = async (id: string): Promise<boolean> => {
  const count = await prisma.product.count({
    where: { categoryId: id },
  });
  return count > 0;
};

export const categoryRepository = {
  findCategories,
  findCategoriesWithHierarchy,
  findCategoryById,
  findCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  existsBySlug,
  existsById,
  hasChildren,
  hasProducts,
};
