import type { WomenItemsConfig } from '@prisma/client';
import { prisma } from '../lib/database';

export const getWomenItemsConfig = async (): Promise<WomenItemsConfig | null> => {
  return prisma.womenItemsConfig.findFirst({ orderBy: { updatedAt: 'desc' } });
};

export const upsertWomenItemsConfig = async (
  data: {
    image: string;
    description: string;
    buttonTitle: string;
    buttonCta: string;
    filterType: string;
    filterValue: string;
  },
): Promise<WomenItemsConfig> => {
  const existing = await prisma.womenItemsConfig.findFirst({
    orderBy: { updatedAt: 'desc' },
  });

  if (existing) {
    return prisma.womenItemsConfig.update({ where: { id: existing.id }, data });
  }

  return prisma.womenItemsConfig.create({ data });
};

export const womenItemsConfigRepository = {
  getWomenItemsConfig,
  upsertWomenItemsConfig,
};
