import type { ContactSubmission, Prisma } from '@prisma/client';
import { prisma } from '../lib/database';

export const findAll = async (
  isAdmin?: boolean,
): Promise<ContactSubmission[]> => {
  const where: Prisma.ContactSubmissionWhereInput = {};
  if (!isAdmin) {
    where.isRead = false;
  }
  return prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

export const findById = async (
  id: string,
): Promise<ContactSubmission | null> => {
  return prisma.contactSubmission.findUnique({ where: { id } });
};

export const create = async (
  data: Prisma.ContactSubmissionCreateInput,
): Promise<ContactSubmission> => {
  return prisma.contactSubmission.create({ data });
};

export const deleteSubmission = async (id: string): Promise<void> => {
  await prisma.contactSubmission.delete({ where: { id } });
};

export const markAsRead = async (id: string): Promise<ContactSubmission> => {
  return prisma.contactSubmission.update({
    where: { id },
    data: { isRead: true },
  });
};

export const contactRepository = {
  findAll,
  findById,
  create,
  deleteSubmission,
  markAsRead,
};
