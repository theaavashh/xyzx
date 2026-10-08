import type { Prisma, StoreSection } from '@prisma/client';
import { IStoreRepository, STORE_REPOSITORY_TOKEN } from '../interfaces/repositories/store.repository.js';
import { ICacheService } from '../interfaces/services/cache.service.js';
import { PrismaClient } from '@prisma/client';

const CACHE_PREFIX = 'store';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

export const createStoreRepository = (prisma: PrismaClient, cacheService: ICacheService): IStoreRepository => {
  const invalidateCache = async (): Promise<void> => {
    await cacheService.invalidatePattern(`${CACHE_PREFIX}:*`);
  };

  const getStore = async (): Promise<StoreSection | null> => {
    const cacheKey = getCacheKey('singleton');
    return cacheService.getOrSet(cacheKey, async () =>
      prisma.storeSection.findFirst({ orderBy: { createdAt: 'desc' } }),
    );
  };

  const createStore = async (data: Prisma.StoreSectionCreateInput): Promise<StoreSection> => {
    const store = await prisma.storeSection.create({ data });
    await invalidateCache();
    return store;
  };

  const updateStore = async (id: string, data: Prisma.StoreSectionUpdateInput): Promise<StoreSection> => {
    const store = await prisma.storeSection.update({ where: { id }, data });
    await invalidateCache();
    return store;
  };

  const toggleStoreStatus = async (id: string): Promise<StoreSection> => {
    const store = await prisma.storeSection.findUnique({ where: { id } });
    if (!store) throw new Error('Store section not found');
    const updated = await prisma.storeSection.update({
      where: { id },
      data: { isActive: !store.isActive },
    });
    await invalidateCache();
    return updated;
  };

  return {
    getStore,
    createStore,
    updateStore,
    toggleStoreStatus,
  };
};

export { STORE_REPOSITORY_TOKEN };