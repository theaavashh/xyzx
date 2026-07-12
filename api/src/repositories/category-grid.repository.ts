import type { CategoryGridItem, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

const CACHE_PREFIX = 'categorygrid';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const invalidateCache = async (): Promise<void> => {
  await Promise.all([
    cacheService.invalidatePattern(`${CACHE_PREFIX}:active*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
  ]);
};

export const findActiveCategoryGridItems = async (): Promise<CategoryGridItem[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.categoryGridItem.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  );
};

export const findAllCategoryGridItems = async (): Promise<CategoryGridItem[]> => {
  return prisma.categoryGridItem.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
};

export const findCategoryGridItemById = async (id: string): Promise<CategoryGridItem | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.categoryGridItem.findUnique({ where: { id } }),
  );
};

export const createCategoryGridItem = async (
  data: Prisma.CategoryGridItemCreateInput,
): Promise<CategoryGridItem> => {
  const item = await prisma.categoryGridItem.create({ data });
  await invalidateCache();
  return item;
};

export const updateCategoryGridItem = async (
  id: string,
  data: Prisma.CategoryGridItemUpdateInput,
): Promise<CategoryGridItem> => {
  const item = await prisma.categoryGridItem.update({ where: { id }, data });
  await invalidateCache();
  return item;
};

export const deleteCategoryGridItem = async (id: string): Promise<void> => {
  await prisma.categoryGridItem.delete({ where: { id } });
  await invalidateCache();
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.categoryGridItem.count({ where: { id } });
  return count > 0;
};

export const toggleCategoryGridItemStatus = async (id: string): Promise<CategoryGridItem> => {
  const item = await prisma.categoryGridItem.findUnique({ where: { id } });
  if (!item) throw new Error('Category grid item not found');
  const updated = await prisma.categoryGridItem.update({
    where: { id },
    data: { isActive: !item.isActive },
  });
  await invalidateCache();
  return updated;
};

export const reorderCategoryGridItems = async (
  orders: Array<{ id: string; order: number }>,
): Promise<void> => {
  await prisma.$transaction(
    orders.map(({ id, order }) =>
      prisma.categoryGridItem.update({ where: { id }, data: { order } }),
    ),
  );
  await invalidateCache();
};

export const categoryGridRepository = {
  findActiveCategoryGridItems,
  findAllCategoryGridItems,
  findCategoryGridItemById,
  createCategoryGridItem,
  updateCategoryGridItem,
  deleteCategoryGridItem,
  existsById,
  toggleCategoryGridItemStatus,
  reorderCategoryGridItems,
};
