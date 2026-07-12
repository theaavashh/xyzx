import type { HeroSlide, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

const CACHE_PREFIX = 'heroslide';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const invalidateCache = async (): Promise<void> => {
  await Promise.all([
    cacheService.invalidatePattern(`${CACHE_PREFIX}:active*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
  ]);
};

export const findActiveHeroSlides = async (): Promise<HeroSlide[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  );
};

export const findAllHeroSlides = async (): Promise<HeroSlide[]> => {
  return prisma.heroSlide.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
};

export const findHeroSlideById = async (id: string): Promise<HeroSlide | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.heroSlide.findUnique({ where: { id } }),
  );
};

export const createHeroSlide = async (
  data: Prisma.HeroSlideCreateInput,
): Promise<HeroSlide> => {
  const item = await prisma.heroSlide.create({ data });
  await invalidateCache();
  return item;
};

export const updateHeroSlide = async (
  id: string,
  data: Prisma.HeroSlideUpdateInput,
): Promise<HeroSlide> => {
  const item = await prisma.heroSlide.update({ where: { id }, data });
  await invalidateCache();
  return item;
};

export const deleteHeroSlide = async (id: string): Promise<void> => {
  await prisma.heroSlide.delete({ where: { id } });
  await invalidateCache();
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.heroSlide.count({ where: { id } });
  return count > 0;
};

export const toggleHeroSlideStatus = async (id: string): Promise<HeroSlide> => {
  const item = await prisma.heroSlide.findUnique({ where: { id } });
  if (!item) throw new Error('Hero slide not found');
  const updated = await prisma.heroSlide.update({
    where: { id },
    data: { isActive: !item.isActive },
  });
  await invalidateCache();
  return updated;
};

export const reorderHeroSlides = async (
  orders: Array<{ id: string; order: number }>,
): Promise<void> => {
  await prisma.$transaction(
    orders.map(({ id, order }) =>
      prisma.heroSlide.update({ where: { id }, data: { order } }),
    ),
  );
  await invalidateCache();
};

export const heroSlideRepository = {
  findActiveHeroSlides,
  findAllHeroSlides,
  findHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  existsById,
  toggleHeroSlideStatus,
  reorderHeroSlides,
};
