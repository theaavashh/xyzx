import type { HeroBanner, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

export interface HeroBannerFilters {
  search?: string;
  isActive?: boolean;
}

export interface HeroBannerSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const CACHE_PREFIX = 'herobanner';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (
  filters: HeroBannerFilters,
): Prisma.HeroBannerWhereInput => {
  const where: Prisma.HeroBannerWhereInput = {};
  if (filters.search) where.title = { contains: filters.search.toLowerCase() };
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.HeroBannerOrderByWithRelationInput => {
  const validSortFields = ['createdAt', 'updatedAt', 'title', 'order'];
  const field = validSortFields.includes(sortBy ?? '') ? sortBy : 'order';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  return { [field!]: order };
};

const invalidateCache = async (): Promise<void> => {
  await Promise.all([
    cacheService.invalidatePattern(`${CACHE_PREFIX}:active*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
  ]);
};

export const findHeroBanners = async (
  page: number,
  limit: number,
  filters: HeroBannerFilters = {},
  sortOptions: HeroBannerSortOptions = {},
): Promise<PaginatedResult<HeroBanner>> => {
  const cacheKey = getCacheKey(
    `list:${page}:${limit}:${JSON.stringify(filters)}:${JSON.stringify(sortOptions)}`,
  );

  return cacheService.getOrSet(cacheKey, async () => {
    const where = buildWhereClause(filters);
    const orderBy = buildOrderByClause(
      sortOptions.sortBy,
      sortOptions.sortOrder,
    );
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.heroBanner.findMany({ where, orderBy, skip, take: limit }),
      prisma.heroBanner.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  });
};

export const findActiveHeroBanners = async (): Promise<HeroBanner[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  );
};

export const findHeroBannerById = async (
  id: string,
): Promise<HeroBanner | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.heroBanner.findUnique({ where: { id } }),
  );
};

export const createHeroBanner = async (
  data: Prisma.HeroBannerCreateInput,
): Promise<HeroBanner> => {
  const banner = await prisma.heroBanner.create({ data });
  await invalidateCache();
  return banner;
};

export const updateHeroBanner = async (
  id: string,
  data: Prisma.HeroBannerUpdateInput,
): Promise<HeroBanner> => {
  const banner = await prisma.heroBanner.update({ where: { id }, data });
  await invalidateCache();
  return banner;
};

export const deleteHeroBanner = async (id: string): Promise<void> => {
  await prisma.heroBanner.delete({ where: { id } });
  await invalidateCache();
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.heroBanner.count({ where: { id } });
  return count > 0;
};

export const toggleHeroBannerStatus = async (
  id: string,
): Promise<HeroBanner> => {
  const banner = await prisma.heroBanner.findUnique({ where: { id } });
  if (!banner) throw new Error('Hero banner not found');
  const updated = await prisma.heroBanner.update({
    where: { id },
    data: { isActive: !banner.isActive },
  });
  await invalidateCache();
  return updated;
};

export const reorderHeroBanners = async (
  orders: Array<{ id: string; order: number }>,
): Promise<void> => {
  await prisma.$transaction(
    orders.map(({ id, order }) =>
      prisma.heroBanner.update({ where: { id }, data: { order } }),
    ),
  );
  await invalidateCache();
};

export const heroBannerRepository = {
  findHeroBanners,
  findActiveHeroBanners,
  findHeroBannerById,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  existsById,
  toggleHeroBannerStatus,
  reorderHeroBanners,
};
