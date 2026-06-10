import type { ShippingItem, ShippingSettings } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

const CACHE_PREFIX = 'shipping';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const invalidateCache = async (): Promise<void> => {
  await cacheService.invalidatePattern(`${CACHE_PREFIX}:*`);
};

export const findItems = async (
  type?: string,
  isAdmin?: boolean,
): Promise<ShippingItem[]> => {
  const cacheKey = getCacheKey(
    `items:${type ?? 'all'}:${isAdmin ? 'admin' : 'public'}`,
  );
  return cacheService.getOrSet(cacheKey, async () => {
    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (!isAdmin) where.isActive = true;
    return prisma.shippingItem.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  });
};

export const findItemById = async (
  id: string,
): Promise<ShippingItem | null> => {
  const cacheKey = getCacheKey(`item:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.shippingItem.findUnique({ where: { id } }),
  );
};

export const createItem = async (
  data: Record<string, unknown>,
): Promise<ShippingItem> => {
  const item = await prisma.shippingItem.create({ data: data as any });
  await invalidateCache();
  return item;
};

export const updateItem = async (
  id: string,
  data: Record<string, unknown>,
): Promise<ShippingItem> => {
  const item = await prisma.shippingItem.update({ where: { id }, data: data as any });
  await invalidateCache();
  return item;
};

export const deleteItem = async (id: string): Promise<void> => {
  await prisma.shippingItem.delete({ where: { id } });
  await invalidateCache();
};

export const toggleItemStatus = async (id: string): Promise<ShippingItem> => {
  const item = await prisma.shippingItem.findUnique({ where: { id } });
  if (!item) throw new Error('Shipping item not found');
  const updated = await prisma.shippingItem.update({
    where: { id },
    data: { isActive: !item.isActive },
  });
  await invalidateCache();
  return updated;
};

export const getSettings = async (): Promise<ShippingSettings> => {
  const cacheKey = getCacheKey('settings');
  return cacheService.getOrSet(cacheKey, async () => {
    let settings = await prisma.shippingSettings.findFirst();
    if (!settings) {
      settings = await prisma.shippingSettings.create({ data: {} });
    }
    return settings;
  });
};

export const updateSettings = async (
  id: string,
  data: Record<string, unknown>,
): Promise<ShippingSettings> => {
  const settings = await prisma.shippingSettings.update({
    where: { id },
    data: data as any,
  });
  await invalidateCache();
  return settings;
};

export const shippingRepository = {
  findItems,
  findItemById,
  createItem,
  updateItem,
  deleteItem,
  toggleItemStatus,
  getSettings,
  updateSettings,
};
