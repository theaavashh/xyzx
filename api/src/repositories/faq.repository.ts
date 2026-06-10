import type { FAQ, Prisma } from '@prisma/client';
import { prisma } from '../lib/database';

export const findAllFAQs = async (isAdmin?: boolean): Promise<FAQ[]> => {
  if (isAdmin) {
    return prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
  }
  return prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
};

export const findFAQById = async (id: string): Promise<FAQ | null> => {
  return prisma.fAQ.findUnique({ where: { id } });
};

export const createFAQ = async (data: Prisma.FAQCreateInput): Promise<FAQ> => {
  return prisma.fAQ.create({ data });
};

export const updateFAQ = async (
  id: string,
  data: Prisma.FAQUpdateInput,
): Promise<FAQ> => {
  return prisma.fAQ.update({ where: { id }, data });
};

export const deleteFAQ = async (id: string): Promise<void> => {
  await prisma.fAQ.delete({ where: { id } });
};

export const toggleFAQStatus = async (id: string): Promise<FAQ> => {
  const faq = await prisma.fAQ.findUnique({ where: { id } });
  if (!faq) throw new Error('FAQ not found');
  return prisma.fAQ.update({
    where: { id },
    data: { isActive: !faq.isActive },
  });
};

export const faqRepository = {
  findAllFAQs,
  findFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQStatus,
};
