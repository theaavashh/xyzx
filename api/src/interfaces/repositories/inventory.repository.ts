import type { Prisma } from '@prisma/client';

export interface StockUpdateData {
  quantity: number;
  changeType: 'STOCK_ADDED' | 'STOCK_DEDUCTED' | 'STOCK_ADJUSTED';
  source?: 'ONLINE' | 'STORE' | 'MANUAL' | 'IMPORT' | 'RETURN';
  orderId?: string;
  reason?: string;
  performedBy?: string;
}

export interface InventoryLogEntry {
  id: string;
  productId: string;
  variantId?: string | null;
  changeType: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  source: string;
  orderId?: string | null;
  reason?: string | null;
  performedBy?: string | null;
  createdAt: Date;
  product?: { name: string; sku: string | null; slug: string };
}

export interface VariantInventoryRow {
  variantId: string;
  productId: string;
  productName: string;
  productSku: string | null;
  color: string | null;
  size: string | null;
  pattern: string | null;
  sku: string | null;
  quantity: number;
  lowStockThreshold: number;
  isActive: boolean;
}

export interface InventoryStats {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  recentChanges: InventoryLogEntry[];
}

export interface IInventoryRepository {
  getStock(productId: string): Promise<number>;

  updateStock(
    productId: string,
    data: StockUpdateData
  ): Promise<{ previousQuantity: number; newQuantity: number }>;

  deductStockForOrder(
    items: Array<{ productId: string; quantity: number }>,
    orderId: string,
    source: 'ONLINE' | 'STORE'
  ): Promise<{ success: boolean; failedItem?: string }>;

  restoreStockForOrder(
    items: Array<{ productId: string; quantity: number }>,
    orderId: string,
    reason?: string
  ): Promise<void>;

  getInventoryLogs(
    productId?: string,
    limit?: number,
    offset?: number
  ): Promise<{ logs: InventoryLogEntry[]; total: number }>;

  getLowStockProducts(
    threshold?: number
  ): Promise<Array<{ id: string; name: string; sku: string | null; quantity: number; lowStockThreshold: number }>>;

  getInventoryStats(): Promise<InventoryStats>;

  getVariantInventory(): Promise<VariantInventoryRow[]>;

  updateVariantStock(
    variantId: string,
    data: StockUpdateData
  ): Promise<{ previousQuantity: number; newQuantity: number }>;
}

export const INVENTORY_REPOSITORY_TOKEN = 'INVENTORY_REPOSITORY';