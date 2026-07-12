import type { ImageGridItem, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

const CACHE_PREFIX = 'imagegrid';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const invalidateCache = async (): Promise<void> => {
  await Promise.all([
    cacheService.invalidatePattern(`${CACHE_PREFIX}:active*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
  ]);
};

export const findActiveImageGridItems = async (): Promise<ImageGridItem[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.imageGridItem.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  );
};

export const findAllImageGridItems = async (): Promise<ImageGridItem[]> => {
  return prisma.imageGridItem.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
};

export const findImageGridItemById = async (id: string): Promise<ImageGridItem | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.imageGridItem.findUnique({ where: { id } }),
  );
};

export const createImageGridItem = async (
  data: Prisma.ImageGridItemCreateInput,
): Promise<ImageGridItem> => {
  const item = await prisma.imageGridItem.create({ data });
  await invalidateCache();
  return item;
};

export const updateImageGridItem = async (
  id: string,
  data: Prisma.ImageGridItemUpdateInput,
): Promise<ImageGridItem> => {
  const item = await prisma.imageGridItem.update({ where: { id }, data });
  await invalidateCache();
  return item;
};

export const deleteImageGridItem = async (id: string): Promise<void> => {
  await prisma.imageGridItem.delete({ where: { id } });
  await invalidateCache();
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.imageGridItem.count({ where: { id } });
  return count > 0;
};

export const toggleImageGridItemStatus = async (id: string): Promise<ImageGridItem> => {
  const item = await prisma.imageGridItem.findUnique({ where: { id } });
  if (!item) throw new Error('Image grid item not found');
  const updated = await prisma.imageGridItem.update({
    where: { id },
    data: { isActive: !item.isActive },
  });
  await invalidateCache();
  return updated;
};

export const reorderImageGridItems = async (
  orders: Array<{ id: string; order: number }>,
): Promise<void> => {
  await prisma.$transaction(
    orders.map(({ id, order }) =>
      prisma.imageGridItem.update({ where: { id }, data: { order } }),
    ),
  );
  await invalidateCache();
};

export const imageGridRepository = {
  findActiveImageGridItems,
  findAllImageGridItems,
  findImageGridItemById,
  createImageGridItem,
  updateImageGridItem,
  deleteImageGridItem,
  existsById,
  toggleImageGridItemStatus,
  reorderImageGridItems,
};
