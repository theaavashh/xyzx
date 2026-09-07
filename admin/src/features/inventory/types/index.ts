export interface InventoryStats {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  recentChanges: InventoryLogEntry[];
}

export interface InventoryLogEntry {
  id: string;
  productId: string;
  changeType: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  source: string;
  orderId?: string;
  reason?: string;
  createdAt: string;
  product?: { name: string; sku: string; slug: string };
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  lowStockThreshold: number;
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

export const sourceColors: Record<string, string> = {
  ONLINE: 'bg-blue-100 text-blue-700',
  STORE: 'bg-orange-100 text-orange-700',
  MANUAL: 'bg-gray-100 text-gray-700',
  IMPORT: 'bg-purple-100 text-purple-700',
  RETURN: 'bg-green-100 text-green-700',
};

export const changeTypeLabels: Record<string, string> = {
  STOCK_ADDED: 'Added',
  STOCK_DEDUCTED: 'Deducted',
  STOCK_ADJUSTED: 'Adjusted',
  STOCK_RESERVED: 'Reserved',
  STOCK_RELEASED: 'Released',
  STOCK_RETURNED: 'Returned',
};
