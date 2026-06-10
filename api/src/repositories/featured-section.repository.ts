import type { FeaturedSection, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

export interface FeaturedSectionFilters {
  search?: string;
  isActive?: boolean;
}

export interface FeaturedSectionSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const CACHE_PREFIX = 'featuredsection';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (
  filters: FeaturedSectionFilters,
): Prisma.FeaturedSectionWhereInput => {
  const where: Prisma.FeaturedSectionWhereInput = {};
  if (filters.search) where.title = { contains: filters.search.toLowerCase() };
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.FeaturedSectionOrderByWithRelationInput => {
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

export const findFeaturedSections = async (
  page: number,
  limit: number,
  filters: FeaturedSectionFilters = {},
  sortOptions: FeaturedSectionSortOptions = {},
): Promise<PaginatedResult<FeaturedSection>> => {
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
      prisma.featuredSection.findMany({ where, orderBy, skip, take: limit }),
      prisma.featuredSection.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  });
};

export const findActiveFeaturedSections = async (): Promise<
  FeaturedSection[]
> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.featuredSection.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  );
};

export const findFeaturedSectionById = async (
  id: string,
): Promise<FeaturedSection | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.featuredSection.findUnique({ where: { id } }),
  );
};

export const createFeaturedSection = async (
  data: Prisma.FeaturedSectionCreateInput,
): Promise<FeaturedSection> => {
  const section = await prisma.featuredSection.create({ data });
  await invalidateCache();
  return section;
};

export const updateFeaturedSection = async (
  id: string,
  data: Prisma.FeaturedSectionUpdateInput,
): Promise<FeaturedSection> => {
  const section = await prisma.featuredSection.update({ where: { id }, data });
  await invalidateCache();
  return section;
};

export const deleteFeaturedSection = async (id: string): Promise<void> => {
  await prisma.featuredSection.delete({ where: { id } });
  await invalidateCache();
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.featuredSection.count({ where: { id } });
  return count > 0;
};

export const toggleFeaturedSectionStatus = async (
  id: string,
): Promise<FeaturedSection> => {
  const section = await prisma.featuredSection.findUnique({ where: { id } });
  if (!section) throw new Error('Featured section not found');
  const updated = await prisma.featuredSection.update({
    where: { id },
    data: { isActive: !section.isActive },
  });
  await invalidateCache();
  return updated;
};

export const reorderFeaturedSections = async (
  orders: Array<{ id: string; order: number }>,
): Promise<void> => {
  await prisma.$transaction(
    orders.map(({ id, order }) =>
      prisma.featuredSection.update({ where: { id }, data: { order } }),
    ),
  );
  await invalidateCache();
};

export const featuredSectionRepository = {
  findFeaturedSections,
  findActiveFeaturedSections,
  findFeaturedSectionById,
  createFeaturedSection,
  updateFeaturedSection,
  deleteFeaturedSection,
  existsById,
  toggleFeaturedSectionStatus,
  reorderFeaturedSections,
};
