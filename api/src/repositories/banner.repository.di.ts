import type { Banner, Prisma } from '@prisma/client';
import { IBannerRepository, BannerFilters, BannerSortOptions, PaginatedResult, BANNER_REPOSITORY_TOKEN } from '../interfaces/repositories/banner.repository.js';
import { ICacheService } from '../interfaces/services/cache.service.js';
import { PrismaClient } from '@prisma/client';

const CACHE_PREFIX = 'banner';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (filters: BannerFilters): Prisma.BannerWhereInput => {
  const where: Prisma.BannerWhereInput = {};
  if (filters.search) where.title = { contains: filters.search.toLowerCase() };
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  if (filters.position) where.position = filters.position;
  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.BannerOrderByWithRelationInput => {
  const validSortFields = ['createdAt', 'updatedAt', 'title', 'position'];
  const field = validSortFields.includes(sortBy ?? '') ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  return { [field!]: order };
};

export const createBannerRepository = (prisma: PrismaClient, cacheService: ICacheService): IBannerRepository => {
  const invalidateCache = async (): Promise<void> => {
    await Promise.all([
      cacheService.invalidatePattern(`${CACHE_PREFIX}:active*`),
      cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`),
      cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
    ]);
  };

  const findBanners = async (
    page: number,
    limit: number,
    filters: BannerFilters = {},
    sortOptions: BannerSortOptions = {},
  ): Promise<PaginatedResult<Banner>> => {
    const cacheKey = getCacheKey(
      `list:${page}:${limit}:${JSON.stringify(filters)}:${JSON.stringify(sortOptions)}`,
    );

    return cacheService.getOrSet(cacheKey, async () => {
      const where = buildWhereClause(filters);
      const orderBy = buildOrderByClause(sortOptions.sortBy, sortOptions.sortOrder);
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        prisma.banner.findMany({ where, orderBy, skip, take: limit }),
        prisma.banner.count({ where }),
      ]);

      return {
        data,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      };
    });
  };

  const findActiveBanners = async (position?: string): Promise<Banner[]> => {
    const cacheKey = getCacheKey(`active:${position || 'all'}`);
    return cacheService.getOrSet(cacheKey, async () => {
      const where: Prisma.BannerWhereInput = { isActive: true };
      if (position) where.position = position;
      return prisma.banner.findMany({ where, orderBy: { createdAt: 'desc' } });
    });
  };

  const findBannerById = async (id: string): Promise<Banner | null> => {
    const cacheKey = getCacheKey(`id:${id}`);
    return cacheService.getOrSet(cacheKey, async () => prisma.banner.findUnique({ where: { id } }));
  };

  const createBanner = async (data: Prisma.BannerCreateInput): Promise<Banner> => {
    const banner = await prisma.banner.create({ data });
    await invalidateCache();
    return banner;
  };

  const updateBanner = async (id: string, data: Prisma.BannerUpdateInput): Promise<Banner> => {
    const banner = await prisma.banner.update({ where: { id }, data });
    await invalidateCache();
    return banner;
  };

  const deleteBanner = async (id: string): Promise<void> => {
    await prisma.banner.delete({ where: { id } });
    await invalidateCache();
  };

  const existsById = async (id: string): Promise<boolean> => {
    const count = await prisma.banner.count({ where: { id } });
    return count > 0;
  };

  const toggleBannerStatus = async (id: string): Promise<Banner> => {
    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new Error('Banner not found');
    const updated = await prisma.banner.update({ where: { id }, data: { isActive: !banner.isActive } });
    await invalidateCache();
    return updated;
  };

  return {
    findBanners,
    findActiveBanners,
    findBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    existsById,
    toggleBannerStatus,
  };
};

export { BANNER_REPOSITORY_TOKEN };