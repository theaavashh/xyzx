import type { HeroSlide, Prisma } from '@prisma/client';
import { IHeroSlideRepository, HERO_SLIDE_REPOSITORY_TOKEN } from '../interfaces/repositories/hero-slide.repository.js';
import { ICacheService } from '../interfaces/services/cache.service.js';
import { PrismaClient } from '@prisma/client';

const CACHE_PREFIX = 'heroslide';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

export const createHeroSlideRepository = (prisma: PrismaClient, cacheService: ICacheService): IHeroSlideRepository => {
  const invalidateCache = async (): Promise<void> => {
    await Promise.all([
      cacheService.invalidatePattern(`${CACHE_PREFIX}:active*`),
      cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
    ]);
  };

  const findActiveHeroSlides = async (): Promise<HeroSlide[]> => {
    const cacheKey = getCacheKey('active:all');
    return cacheService.getOrSet(cacheKey, async () =>
      prisma.heroSlide.findMany({
        where: { isActive: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
    );
  };

  const findAllHeroSlides = async (): Promise<HeroSlide[]> => {
    return prisma.heroSlide.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  };

  const findHeroSlideById = async (id: string): Promise<HeroSlide | null> => {
    const cacheKey = getCacheKey(`id:${id}`);
    return cacheService.getOrSet(cacheKey, async () => prisma.heroSlide.findUnique({ where: { id } }));
  };

  const createHeroSlide = async (data: Prisma.HeroSlideCreateInput): Promise<HeroSlide> => {
    const item = await prisma.heroSlide.create({ data });
    await invalidateCache();
    return item;
  };

  const updateHeroSlide = async (id: string, data: Prisma.HeroSlideUpdateInput): Promise<HeroSlide> => {
    const item = await prisma.heroSlide.update({ where: { id }, data });
    await invalidateCache();
    return item;
  };

  const deleteHeroSlide = async (id: string): Promise<void> => {
    await prisma.heroSlide.delete({ where: { id } });
    await invalidateCache();
  };

  const existsById = async (id: string): Promise<boolean> => {
    const count = await prisma.heroSlide.count({ where: { id } });
    return count > 0;
  };

  const toggleHeroSlideStatus = async (id: string): Promise<HeroSlide> => {
    const item = await prisma.heroSlide.findUnique({ where: { id } });
    if (!item) throw new Error('Hero slide not found');
    const updated = await prisma.heroSlide.update({ where: { id }, data: { isActive: !item.isActive } });
    await invalidateCache();
    return updated;
  };

  const reorderHeroSlides = async (orders: Array<{ id: string; order: number }>): Promise<void> => {
    await prisma.$transaction(
      orders.map(({ id, order }) => prisma.heroSlide.update({ where: { id }, data: { order } })),
    );
    await invalidateCache();
  };

  return {
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
};

export { HERO_SLIDE_REPOSITORY_TOKEN };