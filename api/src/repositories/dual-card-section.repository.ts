import type { DualCardSection, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

export interface DualCardSectionFilters {
  isActive?: boolean;
}

export interface DualCardSectionSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const CACHE_PREFIX = 'dualcard';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (
  filters: DualCardSectionFilters,
): Prisma.DualCardSectionWhereInput => {
  const where: Prisma.DualCardSectionWhereInput = {};
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.DualCardSectionOrderByWithRelationInput => {
  const validSortFields = ['createdAt', 'updatedAt', 'order'];
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

export const findDualCardSections = async (
  page: number,
  limit: number,
  filters: DualCardSectionFilters = {},
  sortOptions: DualCardSectionSortOptions = {},
): Promise<PaginatedResult<DualCardSection>> => {
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
      prisma.dualCardSection.findMany({ where, orderBy, skip, take: limit }),
      prisma.dualCardSection.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  });
};

export const findActiveDualCardSections = async (): Promise<DualCardSection[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.dualCardSection.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  );
};

export const findDualCardSectionById = async (
  id: string,
): Promise<DualCardSection | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.dualCardSection.findUnique({ where: { id } }),
  );
};

export const createDualCardSection = async (
  data: Prisma.DualCardSectionCreateInput,
): Promise<DualCardSection> => {
  const section = await prisma.dualCardSection.create({ data });
  await invalidateCache();
  return section;
};

export const updateDualCardSection = async (
  id: string,
  data: Prisma.DualCardSectionUpdateInput,
): Promise<DualCardSection> => {
  const section = await prisma.dualCardSection.update({ where: { id }, data });
  await invalidateCache();
  return section;
};

export const deleteDualCardSection = async (id: string): Promise<void> => {
  await prisma.dualCardSection.delete({ where: { id } });
  await invalidateCache();
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.dualCardSection.count({ where: { id } });
  return count > 0;
};

export const toggleDualCardSectionStatus = async (
  id: string,
): Promise<DualCardSection> => {
  const section = await prisma.dualCardSection.findUnique({ where: { id } });
  if (!section) throw new Error('Dual card section not found');
  const updated = await prisma.dualCardSection.update({
    where: { id },
    data: { isActive: !section.isActive },
  });
  await invalidateCache();
  return updated;
};

export const reorderDualCardSections = async (
  orders: Array<{ id: string; order: number }>,
): Promise<void> => {
  await prisma.$transaction(
    orders.map(({ id, order }) =>
      prisma.dualCardSection.update({ where: { id }, data: { order } }),
    ),
  );
  await invalidateCache();
};

export const dualCardSectionRepository = {
  findDualCardSections,
  findActiveDualCardSections,
  findDualCardSectionById,
  createDualCardSection,
  updateDualCardSection,
  deleteDualCardSection,
  existsById,
  toggleDualCardSectionStatus,
  reorderDualCardSections,
};
