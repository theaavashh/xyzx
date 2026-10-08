import type { Category, Prisma } from '@prisma/client';
import { ICategoryRepository, CategoryFilters, PaginatedResult, CategoryWithChildren, CATEGORY_REPOSITORY_TOKEN } from '../interfaces/repositories/category.repository.js';
import { ICacheService } from '../interfaces/services/cache.service.js';
import { PrismaClient } from '@prisma/client';

const CACHE_PREFIX = 'category';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (
  filters: CategoryFilters,
): Prisma.CategoryWhereInput => {
  const where: Prisma.CategoryWhereInput = {};
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  return where;
};

export const createCategoryRepository = (prisma: PrismaClient, cacheService: ICacheService): ICategoryRepository => {
  const invalidateCache = async (): Promise<void> => {
    await Promise.all([
      cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`),
      cacheService.invalidatePattern(`${CACHE_PREFIX}:hierarchy*`),
    ]);
  };

  const findCategories = async (
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

  const findCategoriesWithHierarchy = async (): Promise<
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

  const findCategoryById = async (
    id: string,
  ): Promise<Category | null> => {
    const cacheKey = getCacheKey(`id:${id}`);
    return cacheService.getOrSet(cacheKey, async () =>
      prisma.category.findUnique({ where: { id } }),
    );
  };

  const findCategoryBySlug = async (
    slug: string,
  ): Promise<Category | null> => {
    const cacheKey = getCacheKey(`slug:${slug}`);
    return cacheService.getOrSet(cacheKey, async () =>
      prisma.category.findUnique({ where: { slug } }),
    );
  };

  const createCategory = async (
    data: Prisma.CategoryCreateInput,
  ): Promise<Category> => {
    const category = await prisma.category.create({ data });
    await invalidateCache();
    return category;
  };

  const updateCategory = async (
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> => {
    const category = await prisma.category.update({ where: { id }, data });
    await invalidateCache();
    return category;
  };

  const deleteCategory = async (id: string): Promise<void> => {
    await prisma.category.delete({ where: { id } });
    await invalidateCache();
  };

  const existsBySlug = async (slug: string): Promise<boolean> => {
    const count = await prisma.category.count({ where: { slug } });
    return count > 0;
  };

  const existsById = async (id: string): Promise<boolean> => {
    const count = await prisma.category.count({ where: { id } });
    return count > 0;
  };

  const hasChildren = async (id: string): Promise<boolean> => {
    const count = await prisma.category.count({
      where: { parentId: id },
    });
    return count > 0;
  };

  const hasProducts = async (id: string): Promise<boolean> => {
    const count = await prisma.product.count({
      where: { categoryId: id },
    });
    return count > 0;
  };

  return {
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
};

export { CATEGORY_REPOSITORY_TOKEN };