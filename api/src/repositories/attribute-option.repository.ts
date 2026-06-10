import type { AttributeOption, Prisma } from '@prisma/client';
import { prisma } from '../lib/database';

const findAll = async (filters?: { type?: string; isActive?: boolean }): Promise<AttributeOption[]> => {
  const where: Prisma.AttributeOptionWhereInput = {};

  if (filters?.type) {
    where.type = filters.type;
  }
  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return prisma.attributeOption.findMany({
    where,
    orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { value: 'asc' }],
  });
};

const findById = async (id: string): Promise<AttributeOption | null> => {
  return prisma.attributeOption.findUnique({ where: { id } });
};

const create = async (data: Prisma.AttributeOptionCreateInput): Promise<AttributeOption> => {
  return prisma.attributeOption.create({ data });
};

const remove = async (id: string): Promise<void> => {
  await prisma.attributeOption.delete({ where: { id } });
};

export const attributeOptionRepository = {
  findAll,
  findById,
  create,
  remove,
};
