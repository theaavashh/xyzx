import type { ShortDescription } from '@prisma/client';
import { prisma } from '../lib/database';

export const getShortDescription = async (): Promise<ShortDescription | null> => {
  return prisma.shortDescription.findFirst({ orderBy: { updatedAt: 'desc' } });
};

export const upsertShortDescription = async (description: string): Promise<ShortDescription> => {
  const existing = await prisma.shortDescription.findFirst({
    orderBy: { updatedAt: 'desc' },
  });

  if (existing) {
    return prisma.shortDescription.update({
      where: { id: existing.id },
      data: { description },
    });
  }

  return prisma.shortDescription.create({ data: { description } });
};

export const shortDescriptionRepository = {
  getShortDescription,
  upsertShortDescription,
};
