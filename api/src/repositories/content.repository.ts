import type { ContentPage, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

export interface ContentFilters {
  search?: string;
  isActive?: boolean;
}

export interface ContentSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const CACHE_PREFIX = 'content';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (
  filters: ContentFilters,
): Prisma.ContentPageWhereInput => {
  const where: Prisma.ContentPageWhereInput = {};
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    where.OR = [
      { title: { contains: searchLower } },
      { slug: { contains: searchLower } },
      { content: { contains: searchLower } },
    ];
  }
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.ContentPageOrderByWithRelationInput => {
  const validSortFields = ['createdAt', 'updatedAt', 'title', 'slug'];
  const field = validSortFields.includes(sortBy ?? '') ? sortBy : 'title';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  return { [field!]: order };
};

const invalidateCache = async (): Promise<void> => {
  await cacheService.invalidatePattern(`${CACHE_PREFIX}:*`);
};

export const findContentPages = async (
  page: number,
  limit: number,
  filters: ContentFilters = {},
  sortOptions: ContentSortOptions = {},
): Promise<PaginatedResult<ContentPage>> => {
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
      prisma.contentPage.findMany({ where, orderBy, skip, take: limit }),
      prisma.contentPage.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  });
};

export const findContentById = async (
  id: string,
): Promise<ContentPage | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.contentPage.findUnique({ where: { id } }),
  );
};

export const findContentBySlug = async (
  slug: string,
): Promise<ContentPage | null> => {
  const cacheKey = getCacheKey(`slug:${slug}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.contentPage.findUnique({ where: { slug } }),
  );
};

export const createContent = async (
  data: Prisma.ContentPageCreateInput,
): Promise<ContentPage> => {
  const content = await prisma.contentPage.create({ data });
  await invalidateCache();
  return content;
};

export const updateContent = async (
  id: string,
  data: Prisma.ContentPageUpdateInput,
): Promise<ContentPage> => {
  const content = await prisma.contentPage.update({ where: { id }, data });
  await invalidateCache();
  return content;
};

export const updateContentBySlug = async (
  slug: string,
  data: Prisma.ContentPageUpdateInput,
): Promise<ContentPage> => {
  const content = await prisma.contentPage.update({ where: { slug }, data });
  await invalidateCache();
  return content;
};

export const deleteContent = async (id: string): Promise<void> => {
  await prisma.contentPage.delete({ where: { id } });
  await invalidateCache();
};

export const deleteContentBySlug = async (slug: string): Promise<void> => {
  await prisma.contentPage.delete({ where: { slug } });
  await invalidateCache();
};

export const existsBySlug = async (slug: string): Promise<boolean> => {
  const count = await prisma.contentPage.count({ where: { slug } });
  return count > 0;
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.contentPage.count({ where: { id } });
  return count > 0;
};

export const toggleContentStatus = async (id: string): Promise<ContentPage> => {
  const content = await prisma.contentPage.findUnique({ where: { id } });
  if (!content) throw new Error('Content page not found');
  const updated = await prisma.contentPage.update({
    where: { id },
    data: { isActive: !content.isActive },
  });
  await invalidateCache();
  return updated;
};

export const contentRepository = {
  findContentPages,
  findContentById,
  findContentBySlug,
  createContent,
  updateContent,
  updateContentBySlug,
  deleteContent,
  deleteContentBySlug,
  existsBySlug,
  existsById,
  toggleContentStatus,
};
