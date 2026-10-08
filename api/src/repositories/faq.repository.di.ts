import type { FAQ, Prisma } from '@prisma/client';
import { IFAQRepository, FAQ_REPOSITORY_TOKEN } from '../interfaces/repositories/faq.repository.js';
import { PrismaClient } from '@prisma/client';

export const createFAQRepository = (prisma: PrismaClient): IFAQRepository => {
  const findAllFAQs = async (isAdmin?: boolean): Promise<FAQ[]> => {
    if (isAdmin) {
      return prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
    }
    return prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  };

  const findFAQById = async (id: string): Promise<FAQ | null> => {
    return prisma.fAQ.findUnique({ where: { id } });
  };

  const createFAQ = async (data: Prisma.FAQCreateInput): Promise<FAQ> => {
    return prisma.fAQ.create({ data });
  };

  const updateFAQ = async (id: string, data: Prisma.FAQUpdateInput): Promise<FAQ> => {
    return prisma.fAQ.update({ where: { id }, data });
  };

  const deleteFAQ = async (id: string): Promise<void> => {
    await prisma.fAQ.delete({ where: { id } });
  };

  const toggleFAQStatus = async (id: string): Promise<FAQ> => {
    const faq = await prisma.fAQ.findUnique({ where: { id } });
    if (!faq) throw new Error('FAQ not found');
    return prisma.fAQ.update({
      where: { id },
      data: { isActive: !faq.isActive },
    });
  };

  return {
    findAllFAQs,
    findFAQById,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    toggleFAQStatus,
  };
};

export { FAQ_REPOSITORY_TOKEN };