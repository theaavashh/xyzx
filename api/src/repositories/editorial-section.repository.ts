import type { EditorialSection, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

export interface EditorialSectionFilters {
  search?: string;
  isActive?: boolean;
}

export interface EditorialSectionSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const CACHE_PREFIX = 'editorial';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (
  filters: EditorialSectionFilters,
): Prisma.EditorialSectionWhereInput => {
  const where: Prisma.EditorialSectionWhereInput = {};
  if (filters.search) where.title = { contains: filters.search.toLowerCase() };
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.EditorialSectionOrderByWithRelationInput => {
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

export const findEditorialSections = async (
  page: number,
  limit: number,
  filters: EditorialSectionFilters = {},
  sortOptions: EditorialSectionSortOptions = {},
): Promise<PaginatedResult<EditorialSection>> => {
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
      prisma.editorialSection.findMany({ where, orderBy, skip, take: limit }),
      prisma.editorialSection.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  });
};

export const findActiveEditorialSections = async (): Promise<EditorialSection[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.editorialSection.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  );
};

export const findEditorialSectionById = async (
  id: string,
): Promise<EditorialSection | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.editorialSection.findUnique({ where: { id } }),
  );
};

export const createEditorialSection = async (
  data: Prisma.EditorialSectionCreateInput,
): Promise<EditorialSection> => {
  const section = await prisma.editorialSection.create({ data });
  await invalidateCache();
  return section;
};

export const updateEditorialSection = async (
  id: string,
  data: Prisma.EditorialSectionUpdateInput,
): Promise<EditorialSection> => {
  const section = await prisma.editorialSection.update({ where: { id }, data });
  await invalidateCache();
  return section;
};

export const deleteEditorialSection = async (id: string): Promise<void> => {
  await prisma.editorialSection.delete({ where: { id } });
  await invalidateCache();
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.editorialSection.count({ where: { id } });
  return count > 0;
};

export const toggleEditorialSectionStatus = async (
  id: string,
): Promise<EditorialSection> => {
  const section = await prisma.editorialSection.findUnique({ where: { id } });
  if (!section) throw new Error('Editorial section not found');
  const updated = await prisma.editorialSection.update({
    where: { id },
    data: { isActive: !section.isActive },
  });
  await invalidateCache();
  return updated;
};

export const reorderEditorialSections = async (
  orders: Array<{ id: string; order: number }>,
): Promise<void> => {
  await prisma.$transaction(
    orders.map(({ id, order }) =>
      prisma.editorialSection.update({ where: { id }, data: { order } }),
    ),
  );
  await invalidateCache();
};

export const editorialSectionRepository = {
  findEditorialSections,
  findActiveEditorialSections,
  findEditorialSectionById,
  createEditorialSection,
  updateEditorialSection,
  deleteEditorialSection,
  existsById,
  toggleEditorialSectionStatus,
  reorderEditorialSections,
};
