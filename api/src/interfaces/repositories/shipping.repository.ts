import type { ShippingItem, ShippingSettings } from '@prisma/client';

export interface IShippingRepository {
  findItems(
    type?: string,
    isAdmin?: boolean
  ): Promise<ShippingItem[]>;

  findItemById(id: string): Promise<ShippingItem | null>;

  createItem(data: Record<string, unknown>): Promise<ShippingItem>;

  updateItem(id: string, data: Record<string, unknown>): Promise<ShippingItem>;

  deleteItem(id: string): Promise<void>;

  toggleItemStatus(id: string): Promise<ShippingItem>;

  getSettings(): Promise<ShippingSettings>;

  updateSettings(id: string, data: Record<string, unknown>): Promise<ShippingSettings>;
}

export const SHIPPING_REPOSITORY_TOKEN = 'SHIPPING_REPOSITORY';