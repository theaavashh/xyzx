import type { FAQ, Prisma } from '@prisma/client';

export interface IFAQRepository {
  findAllFAQs(isAdmin?: boolean): Promise<FAQ[]>;

  findFAQById(id: string): Promise<FAQ | null>;

  createFAQ(data: Prisma.FAQCreateInput): Promise<FAQ>;

  updateFAQ(id: string, data: Prisma.FAQUpdateInput): Promise<FAQ>;

  deleteFAQ(id: string): Promise<void>;

  toggleFAQStatus(id: string): Promise<FAQ>;
}

export const FAQ_REPOSITORY_TOKEN = 'FAQ_REPOSITORY';