import type { ThreeImageGridSection, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

const CACHE_PREFIX = 'threeimg';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const invalidateCache = async (): Promise<void> => {
  await Promise.all([
    cacheService.invalidatePattern(`${CACHE_PREFIX}:active*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
  ]);
};

const sectionInclude = {
  columns: { orderBy: { order: 'asc' as const } },
};

export const findActiveThreeImageGridSections = async (): Promise<ThreeImageGridSection[]> => {
  const cacheKey = getCacheKey('active:all');
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.threeImageGridSection.findMany({
      where: { isActive: true },
      include: sectionInclude,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
  );
};

export const findAllThreeImageGridSections = async (): Promise<ThreeImageGridSection[]> => {
  return prisma.threeImageGridSection.findMany({
    include: sectionInclude,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
};

export const findThreeImageGridSectionById = async (id: string): Promise<ThreeImageGridSection | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.threeImageGridSection.findUnique({ where: { id }, include: sectionInclude }),
  );
};

export const createThreeImageGridSection = async (data: {
  isActive?: boolean;
  order?: number;
  columns: {
    imageSrc: string;
    imageAlt: string;
    imageLink?: string;
    productName?: string;
    productPrice?: number;
    productOriginalPrice?: number;
    productImage?: string;
    productLink?: string;
    order?: number;
  }[];
}): Promise<ThreeImageGridSection> => {
  const section = await prisma.threeImageGridSection.create({
    data: {
      isActive: data.isActive ?? true,
      order: data.order ?? 0,
      columns: {
        create: data.columns.map((col, i) => ({
          imageSrc: col.imageSrc,
          imageAlt: col.imageAlt,
          imageLink: col.imageLink || null,
          productName: col.productName || null,
          productPrice: col.productPrice ?? null,
          productOriginalPrice: col.productOriginalPrice ?? null,
          productImage: col.productImage || null,
          productLink: col.productLink || null,
          order: col.order ?? i,
        })),
      },
    },
    include: sectionInclude,
  });
  await invalidateCache();
  return section;
};

export const updateThreeImageGridSection = async (
  id: string,
  data: {
    isActive?: boolean;
    order?: number;
    columns?: {
      id?: string;
      imageSrc: string;
      imageAlt: string;
      imageLink?: string;
      productName?: string;
      productPrice?: number;
      productOriginalPrice?: number;
      productImage?: string;
      productLink?: string;
      order?: number;
    }[];
  },
): Promise<ThreeImageGridSection> => {
  if (data.columns) {
    await prisma.threeImageGridColumn.deleteMany({ where: { sectionId: id } });
  }

  const section = await prisma.threeImageGridSection.update({
    where: { id },
    data: {
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.columns && {
        columns: {
          create: data.columns.map((col, i) => ({
            imageSrc: col.imageSrc,
            imageAlt: col.imageAlt,
            imageLink: col.imageLink || null,
            productName: col.productName || null,
            productPrice: col.productPrice ?? null,
            productOriginalPrice: col.productOriginalPrice ?? null,
            productImage: col.productImage || null,
            productLink: col.productLink || null,
            order: col.order ?? i,
          })),
        },
      }),
    },
    include: sectionInclude,
  });
  await invalidateCache();
  return section;
};

export const deleteThreeImageGridSection = async (id: string): Promise<void> => {
  await prisma.threeImageGridSection.delete({ where: { id } });
  await invalidateCache();
};

export const toggleThreeImageGridSectionStatus = async (id: string): Promise<ThreeImageGridSection> => {
  const section = await prisma.threeImageGridSection.findUnique({ where: { id } });
  if (!section) throw new Error('Section not found');
  const updated = await prisma.threeImageGridSection.update({
    where: { id },
    data: { isActive: !section.isActive },
    include: sectionInclude,
  });
  await invalidateCache();
  return updated;
};

export const threeImageGridRepository = {
  findActiveThreeImageGridSections,
  findAllThreeImageGridSections,
  findThreeImageGridSectionById,
  createThreeImageGridSection,
  updateThreeImageGridSection,
  deleteThreeImageGridSection,
  toggleThreeImageGridSectionStatus,
};
