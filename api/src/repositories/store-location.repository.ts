import type { Prisma, StoreLocation } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

const CACHE_PREFIX = 'store-locations';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const invalidateCache = async (): Promise<void> => {
  await cacheService.invalidatePattern(`${CACHE_PREFIX}:*`);
};

export const findAllStoreLocations = async (isAdmin = false): Promise<StoreLocation[]> => {
  const cacheKey = getCacheKey(isAdmin ? 'all' : 'public');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.storeLocation.findMany({
      where: isAdmin ? undefined : { isActive: true },
      orderBy: { order: 'asc' },
    }),
  );
};

export const findStoreLocationById = async (id: string): Promise<StoreLocation | null> => {
  return prisma.storeLocation.findUnique({ where: { id } });
};

export const findStoreLocationBySlug = async (slug: string): Promise<StoreLocation | null> => {
  return prisma.storeLocation.findUnique({ where: { slug } });
};

export const createStoreLocation = async (
  data: Prisma.StoreLocationCreateInput,
): Promise<StoreLocation> => {
  const store = await prisma.storeLocation.create({ data });
  await invalidateCache();
  return store;
};

export const updateStoreLocation = async (
  id: string,
  data: Prisma.StoreLocationUpdateInput,
): Promise<StoreLocation> => {
  const store = await prisma.storeLocation.update({ where: { id }, data });
  await invalidateCache();
  return store;
};

export const deleteStoreLocation = async (id: string): Promise<void> => {
  await prisma.storeLocation.delete({ where: { id } });
  await invalidateCache();
};

export const toggleStoreLocationStatus = async (id: string): Promise<StoreLocation> => {
  const store = await prisma.storeLocation.findUnique({ where: { id } });
  if (!store) throw new Error('Store location not found');
  const updated = await prisma.storeLocation.update({
    where: { id },
    data: { isActive: !store.isActive },
  });
  await invalidateCache();
  return updated;
};

export const storeLocationRepository = {
  findAllStoreLocations,
  findStoreLocationById,
  findStoreLocationBySlug,
  createStoreLocation,
  updateStoreLocation,
  deleteStoreLocation,
  toggleStoreLocationStatus,
};
