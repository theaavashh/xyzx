import { prisma } from '../lib/database';
import type { Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';

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

const CACHE_PREFIX = 'inventory';

export const getStock = async (productId: string): Promise<number> => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { quantity: true },
  });
  return product?.quantity ?? 0;
};

export const updateStock = async (
  productId: string,
  data: StockUpdateData,
): Promise<{ previousQuantity: number; newQuantity: number }> => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { quantity: true, manageStock: true },
  });

  if (!product) throw new Error('Product not found');
  if (!product.manageStock) throw new Error('Stock management disabled for this product');

  const previousQuantity = product.quantity;
  let newQuantity: number;

  switch (data.changeType) {
    case 'STOCK_ADDED':
      newQuantity = previousQuantity + data.quantity;
      break;
    case 'STOCK_DEDUCTED':
      newQuantity = Math.max(0, previousQuantity - data.quantity);
      break;
    case 'STOCK_ADJUSTED':
      newQuantity = data.quantity;
      break;
    default:
      throw new Error(`Invalid change type: ${data.changeType}`);
  }

  const [log] = await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { quantity: newQuantity },
    }),
    prisma.inventoryLog.create({
      data: {
        productId,
        changeType: data.changeType,
        quantity: Math.abs(data.changeType === 'STOCK_DEDUCTED' ? -data.quantity : data.quantity),
        previousQuantity,
        newQuantity,
        source: data.source || 'MANUAL',
        orderId: data.orderId,
        reason: data.reason,
        performedBy: data.performedBy,
      },
    }),
  ]);

  await cacheService.invalidatePattern(`${CACHE_PREFIX}:*`);

  return { previousQuantity, newQuantity };
};

export const deductStockForOrder = async (
  items: Array<{ productId: string; quantity: number }>,
  orderId: string,
  source: 'ONLINE' | 'STORE' = 'ONLINE',
): Promise<{ success: boolean; failedItem?: string }> => {
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { id: true, quantity: true, manageStock: true, trackQuantity: true },
    });

    if (!product || !product.manageStock || !product.trackQuantity) continue;

    // Atomic update: only deduct if sufficient stock exists
    const result = await prisma.$executeRaw`
      UPDATE products
      SET quantity = GREATEST(0, quantity - ${item.quantity})
      WHERE id = ${item.productId}
        AND manageStock = true
        AND trackQuantity = true
        AND quantity >= ${item.quantity}
    `;

    if (result === 0) {
      // Insufficient stock — this item cannot be fulfilled
      return { success: false, failedItem: item.productId };
    }

    // Read back the actual quantity after deduction for logging
    const updated = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { quantity: true },
    });

    await prisma.inventoryLog.create({
      data: {
        productId: item.productId,
        changeType: 'STOCK_DEDUCTED',
        quantity: -item.quantity,
        previousQuantity: product.quantity,
        newQuantity: updated?.quantity ?? 0,
        source,
        orderId,
        reason: `Order ${orderId}`,
      },
    });
  }

  await cacheService.invalidatePattern(`${CACHE_PREFIX}:*`);
  return { success: true };
};

export const restoreStockForOrder = async (
  items: Array<{ productId: string; quantity: number }>,
  orderId: string,
  reason: string = 'Order cancelled',
): Promise<void> => {
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { id: true, quantity: true, manageStock: true },
    });

    if (!product || !product.manageStock) continue;

    // Atomic update: add stock back
    await prisma.$executeRaw`
      UPDATE products
      SET quantity = quantity + ${item.quantity}
      WHERE id = ${item.productId}
        AND manageStock = true
    `;

    const updated = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { quantity: true },
    });

    await prisma.inventoryLog.create({
      data: {
        productId: item.productId,
        changeType: 'STOCK_RETURNED',
        quantity: item.quantity,
        previousQuantity: product.quantity,
        newQuantity: updated?.quantity ?? product.quantity + item.quantity,
        source: 'RETURN',
        orderId,
        reason,
      },
    });
  }

  await cacheService.invalidatePattern(`${CACHE_PREFIX}:*`);
};

export const getInventoryLogs = async (
  productId?: string,
  limit: number = 50,
  offset: number = 0,
): Promise<{ logs: InventoryLogEntry[]; total: number }> => {
  const where: Prisma.InventoryLogWhereInput = {};
  if (productId) where.productId = productId;

  const [logs, total] = await Promise.all([
    prisma.inventoryLog.findMany({
      where,
      include: { product: { select: { name: true, sku: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.inventoryLog.count({ where }),
  ]);

  return { logs: logs as InventoryLogEntry[], total };
};

export const getLowStockProducts = async (
  threshold?: number,
): Promise<Array<{ id: string; name: string; sku: string | null; quantity: number; lowStockThreshold: number }>> => {
  const products = await prisma.product.findMany({
    where: {
      manageStock: true,
      trackQuantity: true,
    },
    select: {
      id: true,
      name: true,
      sku: true,
      quantity: true,
      lowStockThreshold: true,
    },
  });

  return products.filter((p) => {
    const t = threshold ?? p.lowStockThreshold;
    return p.quantity <= t;
  });
};

export const getInventoryStats = async (): Promise<{
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  recentChanges: InventoryLogEntry[];
}> => {
  const [totalProducts, stockAgg, lowStockCount, outOfStockCount, recentChanges] =
    await Promise.all([
      prisma.product.count({ where: { manageStock: true } }),
      prisma.product.aggregate({
        where: { manageStock: true },
        _sum: { quantity: true },
      }),
      prisma.product.count({
        where: { manageStock: true, trackQuantity: true, quantity: { lte: 5, gt: 0 } },
      }),
      prisma.product.count({
        where: { manageStock: true, trackQuantity: true, quantity: 0 },
      }),
      prisma.inventoryLog.findMany({
        include: { product: { select: { name: true, sku: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

  return {
    totalProducts,
    totalStock: stockAgg._sum.quantity ?? 0,
    lowStockCount,
    outOfStockCount,
    recentChanges: recentChanges as InventoryLogEntry[],
  };
};

export const getVariantInventory = async (): Promise<VariantInventoryRow[]> => {
  const variants = await prisma.productVariant.findMany({
    where: { product: { manageStock: true } },
    include: { product: { select: { name: true, sku: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return variants.map((v) => ({
    variantId: v.id,
    productId: v.productId,
    productName: v.product.name,
    productSku: v.product.sku,
    color: v.color,
    size: v.size,
    pattern: v.pattern,
    sku: v.sku,
    quantity: v.quantity,
    lowStockThreshold: v.lowStockThreshold,
    isActive: v.isActive,
  }));
};

export const updateVariantStock = async (
  variantId: string,
  data: StockUpdateData,
): Promise<{ previousQuantity: number; newQuantity: number }> => {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    select: { quantity: true, productId: true },
  });

  if (!variant) throw new Error('Variant not found');
  if (!variant.productId) throw new Error('Variant is not linked to a product');

  const previousQuantity = variant.quantity;
  let newQuantity: number;

  switch (data.changeType) {
    case 'STOCK_ADDED':
      newQuantity = previousQuantity + data.quantity;
      break;
    case 'STOCK_DEDUCTED':
      newQuantity = Math.max(0, previousQuantity - data.quantity);
      break;
    case 'STOCK_ADJUSTED':
      newQuantity = data.quantity;
      break;
    default:
      throw new Error(`Invalid change type: ${data.changeType}`);
  }

  const [log] = await prisma.$transaction([
    prisma.productVariant.update({
      where: { id: variantId },
      data: { quantity: newQuantity },
    }),
    prisma.inventoryLog.create({
      data: {
        productId: variant.productId,
        variantId,
        changeType: data.changeType,
        quantity: Math.abs(
          data.changeType === 'STOCK_DEDUCTED' ? -data.quantity : data.quantity,
        ),
        previousQuantity,
        newQuantity,
        source: data.source || 'MANUAL',
        orderId: data.orderId,
        reason: data.reason,
        performedBy: data.performedBy,
      },
    }),
  ]);

  await cacheService.invalidatePattern(`${CACHE_PREFIX}:*`);

  return { previousQuantity, newQuantity };
};

export const inventoryRepository = {
  getStock,
  updateStock,
  deductStockForOrder,
  restoreStockForOrder,
  getInventoryLogs,
  getLowStockProducts,
  getInventoryStats,
  getVariantInventory,
  updateVariantStock,
};
