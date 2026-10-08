import type { Prisma, StoreSection } from '@prisma/client';

export interface IStoreRepository {
  getStore(): Promise<StoreSection | null>;

  createStore(data: Prisma.StoreSectionCreateInput): Promise<StoreSection>;

  updateStore(id: string, data: Prisma.StoreSectionUpdateInput): Promise<StoreSection>;

  toggleStoreStatus(id: string): Promise<StoreSection>;
}

export const STORE_REPOSITORY_TOKEN = 'STORE_REPOSITORY';