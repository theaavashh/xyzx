import type { CategoryTileGridSection, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

const CACHE_PREFIX = 'categorytile';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const invalidateCache = async (): Promise<void> => {
  await Promise.all([
    cacheService.invalidatePattern(`${CACHE_PREFIX}:active*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
  ]);
};

const sectionInclude = {
  items: { orderBy: { order: 'asc' as const } },
};

export const findActiveCategoryTileGridSections = async (): Promise<CategoryTileGridSection[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.categoryTileGridSection.findMany({
      where: { isActive: true },
      include: sectionInclude,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  );
};

export const findAllCategoryTileGridSections = async (): Promise<CategoryTileGridSection[]> => {
  return prisma.categoryTileGridSection.findMany({
    include: sectionInclude,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
};

export const findCategoryTileGridSectionById = async (id: string): Promise<CategoryTileGridSection | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.categoryTileGridSection.findUnique({ where: { id }, include: sectionInclude }),
  );
};

export const createCategoryTileGridSection = async (data: {
  isActive?: boolean;
  order?: number;
  items: {
    title: string;
    subtitle?: string;
    image: string;
    link: string;
    order?: number;
  }[];
}): Promise<CategoryTileGridSection> => {
  const section = await prisma.categoryTileGridSection.create({
    data: {
      isActive: data.isActive ?? true,
      order: data.order ?? 0,
      items: {
        create: data.items.map((item, i) => ({
          title: item.title,
          subtitle: item.subtitle || null,
          image: item.image,
          link: item.link,
          order: item.order ?? i,
        })),
      },
    },
    include: sectionInclude,
  });
  await invalidateCache();
  return section;
};

export const updateCategoryTileGridSection = async (
  id: string,
  data: {
    isActive?: boolean;
    order?: number;
    items?: {
      id?: string;
      title: string;
      subtitle?: string;
      image: string;
      link: string;
      order?: number;
    }[];
  },
): Promise<CategoryTileGridSection> => {
  if (data.items) {
    await prisma.categoryTileGridItem.deleteMany({ where: { sectionId: id } });
  }

  const section = await prisma.categoryTileGridSection.update({
    where: { id },
    data: {
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.items && {
        items: {
          create: data.items.map((item, i) => ({
            title: item.title,
            subtitle: item.subtitle || null,
            image: item.image,
            link: item.link,
            order: item.order ?? i,
          })),
        },
      }),
    },
    include: sectionInclude,
  });
  await invalidateCache();
  return section;
};

export const deleteCategoryTileGridSection = async (id: string): Promise<void> => {
  await prisma.categoryTileGridSection.delete({ where: { id } });
  await invalidateCache();
};

export const toggleCategoryTileGridSectionStatus = async (id: string): Promise<CategoryTileGridSection> => {
  const section = await prisma.categoryTileGridSection.findUnique({ where: { id } });
  if (!section) throw new Error('Section not found');
  const updated = await prisma.categoryTileGridSection.update({
    where: { id },
    data: { isActive: !section.isActive },
    include: sectionInclude,
  });
  await invalidateCache();
  return updated;
};

export const categoryTileGridRepository = {
  findActiveCategoryTileGridSections,
  findAllCategoryTileGridSections,
  findCategoryTileGridSectionById,
  createCategoryTileGridSection,
  updateCategoryTileGridSection,
  deleteCategoryTileGridSection,
  toggleCategoryTileGridSectionStatus,
};
