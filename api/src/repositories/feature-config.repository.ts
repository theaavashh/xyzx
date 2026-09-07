import type { FeatureConfig, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

const CACHE_PREFIX = 'feature-config';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const invalidateCache = async (): Promise<void> => {
  await Promise.all([
    cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:active*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
  ]);
};

export const findFeatureConfigs = async (
  page: number,
  limit: number,
  filters: { search?: string; isActive?: boolean } = {},
  sortOptions: { sortBy?: string; sortOrder?: 'asc' | 'desc' } = {},
): Promise<{ data: FeatureConfig[]; pagination: { page: number; limit: number; total: number; pages: number } }> => {
  const cacheKey = getCacheKey(`list:${page}:${limit}:${JSON.stringify(filters)}:${JSON.stringify(sortOptions)}`);
  return cacheService.getOrSet(cacheKey, async () => {
    const where: Prisma.FeatureConfigWhereInput = {};
    if (filters.search) where.OR = [{ title: { contains: filters.search } }, { description: { contains: filters.search } }];
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    const orderBy: Prisma.FeatureConfigOrderByWithRelationInput = { order: 'asc' };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.featureConfig.findMany({ where, orderBy, skip, take: limit }),
      prisma.featureConfig.count({ where }),
    ]);
    return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  });
};

export const findActiveFeatureConfigs = async (): Promise<FeatureConfig[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () => {
    return prisma.featureConfig.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
  });
};

export const findFeatureConfigById = async (id: string): Promise<FeatureConfig | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () => {
    return prisma.featureConfig.findUnique({ where: { id } });
  });
};

export const createFeatureConfig = async (data: Prisma.FeatureConfigCreateInput): Promise<FeatureConfig> => {
  const config = await prisma.featureConfig.create({ data });
  await invalidateCache();
  return config;
};

export const updateFeatureConfig = async (id: string, data: Prisma.FeatureConfigUpdateInput): Promise<FeatureConfig | null> => {
  try {
    const config = await prisma.featureConfig.update({ where: { id }, data });
    await invalidateCache();
    return config;
  } catch {
    return null;
  }
};

export const deleteFeatureConfig = async (id: string): Promise<boolean> => {
  try {
    await prisma.featureConfig.delete({ where: { id } });
    await invalidateCache();
    return true;
  } catch {
    return false;
  }
};

export const toggleFeatureConfigStatus = async (id: string): Promise<FeatureConfig | null> => {
  const config = await prisma.featureConfig.findUnique({ where: { id } });
  if (!config) return null;
  return updateFeatureConfig(id, { isActive: !config.isActive });
};
