import type { Prisma, StoreSection } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

const CACHE_PREFIX = 'store';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const invalidateCache = async (): Promise<void> => {
  await cacheService.invalidatePattern(`${CACHE_PREFIX}:*`);
};

export const getStore = async (): Promise<StoreSection | null> => {
  const cacheKey = getCacheKey('singleton');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.storeSection.findFirst({ orderBy: { createdAt: 'desc' } }),
  );
};

export const createStore = async (
  data: Prisma.StoreSectionCreateInput,
): Promise<StoreSection> => {
  const store = await prisma.storeSection.create({ data });
  await invalidateCache();
  return store;
};

export const updateStore = async (
  id: string,
  data: Prisma.StoreSectionUpdateInput,
): Promise<StoreSection> => {
  const store = await prisma.storeSection.update({ where: { id }, data });
  await invalidateCache();
  return store;
};

export const toggleStoreStatus = async (id: string): Promise<StoreSection> => {
  const store = await prisma.storeSection.findUnique({ where: { id } });
  if (!store) throw new Error('Store section not found');
  const updated = await prisma.storeSection.update({
    where: { id },
    data: { isActive: !store.isActive },
  });
  await invalidateCache();
  return updated;
};

export const storeRepository = {
  getStore,
  createStore,
  updateStore,
  toggleStoreStatus,
};
