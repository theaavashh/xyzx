import type { PromotionalBanner, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

const CACHE_PREFIX = 'promo-banner';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const invalidateCache = async (): Promise<void> => {
  await Promise.all([
    cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:active*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
  ]);
};

export const findPromotionalBanners = async (
  page: number,
  limit: number,
  filters: { search?: string; isActive?: boolean } = {},
  sortOptions: { sortBy?: string; sortOrder?: 'asc' | 'desc' } = {},
): Promise<{ data: PromotionalBanner[]; pagination: { page: number; limit: number; total: number; pages: number } }> => {
  const cacheKey = getCacheKey(`list:${page}:${limit}:${JSON.stringify(filters)}:${JSON.stringify(sortOptions)}`);
  return cacheService.getOrSet(cacheKey, async () => {
    const where: Prisma.PromotionalBannerWhereInput = {};
    if (filters.search) where.OR = [{ title: { contains: filters.search } }, { subtitle: { contains: filters.search } }];
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    const orderBy: Prisma.PromotionalBannerOrderByWithRelationInput = { order: 'asc' };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.promotionalBanner.findMany({ where, orderBy, skip, take: limit }),
      prisma.promotionalBanner.count({ where }),
    ]);
    return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  });
};

export const findActivePromotionalBanners = async (): Promise<PromotionalBanner[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () => {
    return prisma.promotionalBanner.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
  });
};

export const findPromotionalBannerById = async (id: string): Promise<PromotionalBanner | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () => {
    return prisma.promotionalBanner.findUnique({ where: { id } });
  });
};

export const createPromotionalBanner = async (data: Prisma.PromotionalBannerCreateInput): Promise<PromotionalBanner> => {
  const banner = await prisma.promotionalBanner.create({ data });
  await invalidateCache();
  return banner;
};

export const updatePromotionalBanner = async (id: string, data: Prisma.PromotionalBannerUpdateInput): Promise<PromotionalBanner | null> => {
  try {
    const banner = await prisma.promotionalBanner.update({ where: { id }, data });
    await invalidateCache();
    return banner;
  } catch {
    return null;
  }
};

export const deletePromotionalBanner = async (id: string): Promise<boolean> => {
  try {
    await prisma.promotionalBanner.delete({ where: { id } });
    await invalidateCache();
    return true;
  } catch {
    return false;
  }
};

export const togglePromotionalBannerStatus = async (id: string): Promise<PromotionalBanner | null> => {
  const banner = await prisma.promotionalBanner.findUnique({ where: { id } });
  if (!banner) return null;
  return updatePromotionalBanner(id, { isActive: !banner.isActive });
};
