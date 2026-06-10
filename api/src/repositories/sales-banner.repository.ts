import type { SalesBanner, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

export interface SalesBannerFilters {
  search?: string;
  isActive?: boolean;
}

export interface SalesBannerSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const CACHE_PREFIX = 'salesbanner';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (
  filters: SalesBannerFilters,
): Prisma.SalesBannerWhereInput => {
  const where: Prisma.SalesBannerWhereInput = {};
  if (filters.search) where.title = { contains: filters.search.toLowerCase() };
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.SalesBannerOrderByWithRelationInput => {
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

export const findSalesBanners = async (
  page: number,
  limit: number,
  filters: SalesBannerFilters = {},
  sortOptions: SalesBannerSortOptions = {},
): Promise<PaginatedResult<SalesBanner>> => {
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
      prisma.salesBanner.findMany({ where, orderBy, skip, take: limit }),
      prisma.salesBanner.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  });
};

export const findActiveSalesBanners = async (): Promise<SalesBanner[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.salesBanner.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  );
};

export const findSalesBannerById = async (
  id: string,
): Promise<SalesBanner | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.salesBanner.findUnique({ where: { id } }),
  );
};

export const createSalesBanner = async (
  data: Prisma.SalesBannerCreateInput,
): Promise<SalesBanner> => {
  const banner = await prisma.salesBanner.create({ data });
  await invalidateCache();
  return banner;
};

export const updateSalesBanner = async (
  id: string,
  data: Prisma.SalesBannerUpdateInput,
): Promise<SalesBanner> => {
  const banner = await prisma.salesBanner.update({ where: { id }, data });
  await invalidateCache();
  return banner;
};

export const deleteSalesBanner = async (id: string): Promise<void> => {
  await prisma.salesBanner.delete({ where: { id } });
  await invalidateCache();
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.salesBanner.count({ where: { id } });
  return count > 0;
};

export const toggleSalesBannerStatus = async (
  id: string,
): Promise<SalesBanner> => {
  const banner = await prisma.salesBanner.findUnique({ where: { id } });
  if (!banner) throw new Error('Sales banner not found');
  const updated = await prisma.salesBanner.update({
    where: { id },
    data: { isActive: !banner.isActive },
  });
  await invalidateCache();
  return updated;
};

export const reorderSalesBanners = async (
  orders: Array<{ id: string; order: number }>,
): Promise<void> => {
  await prisma.$transaction(
    orders.map(({ id, order }) =>
      prisma.salesBanner.update({ where: { id }, data: { order } }),
    ),
  );
  await invalidateCache();
};

export const salesBannerRepository = {
  findSalesBanners,
  findActiveSalesBanners,
  findSalesBannerById,
  createSalesBanner,
  updateSalesBanner,
  deleteSalesBanner,
  existsById,
  toggleSalesBannerStatus,
  reorderSalesBanners,
};
