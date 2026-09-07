import type { Request, RequestHandler, Response } from 'express';
import { inventoryRepository } from '../repositories/inventory.repository';
import { asyncHandler, sendBadRequest, sendNotFound, sendSuccess } from '../utils';
import { logger } from '../utils/logger';

export const getInventoryStats: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await inventoryRepository.getInventoryStats();
    sendSuccess(res, stats);
  },
);

export const getStock: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    if (!productId) {
      sendBadRequest(res, 'Product ID is required');
      return;
    }

    const stock = await inventoryRepository.getStock(productId);
    sendSuccess(res, { productId, stock });
  },
);

export const updateStock: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    const { quantity, changeType, source, reason } = req.body;

    if (!productId) {
      sendBadRequest(res, 'Product ID is required');
      return;
    }

    if (!quantity || !changeType) {
      sendBadRequest(res, 'Quantity and changeType are required');
      return;
    }

    const validTypes = ['STOCK_ADDED', 'STOCK_DEDUCTED', 'STOCK_ADJUSTED'];
    if (!validTypes.includes(changeType)) {
      sendBadRequest(res, `Invalid changeType. Must be one of: ${validTypes.join(', ')}`);
      return;
    }

    try {
      const result = await inventoryRepository.updateStock(productId, {
        quantity: Number(quantity),
        changeType,
        source: source || 'MANUAL',
        reason,
        performedBy: req.user?.userId,
      });

      logger.info('Stock updated', {
        productId,
        changeType,
        previousQuantity: result.previousQuantity,
        newQuantity: result.newQuantity,
      });

      sendSuccess(res, result, 'Stock updated successfully');
    } catch (error) {
      const err = error as Error;
      logger.error('Stock update failed', { productId }, err);
      sendBadRequest(res, err.message);
    }
  },
);

export const getLowStockProducts: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const threshold = req.query.threshold ? Number(req.query.threshold) : undefined;
    const products = await inventoryRepository.getLowStockProducts(threshold);
    sendSuccess(res, { products, count: products.length });
  },
);

export const getInventoryLogs: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.query;
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const result = await inventoryRepository.getInventoryLogs(
      productId as string | undefined,
      limit,
      offset,
    );

    sendSuccess(res, result);
  },
);

export const getVariantInventory: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const variants = await inventoryRepository.getVariantInventory();
    sendSuccess(res, { variants, count: variants.length });
  },
);

export const updateVariantStock: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const variantId = req.params.variantId as string;
    const { quantity, changeType, source, reason } = req.body;

    if (!variantId) {
      sendBadRequest(res, 'Variant ID is required');
      return;
    }

    if (!quantity || !changeType) {
      sendBadRequest(res, 'Quantity and changeType are required');
      return;
    }

    const validTypes = ['STOCK_ADDED', 'STOCK_DEDUCTED', 'STOCK_ADJUSTED'];
    if (!validTypes.includes(changeType)) {
      sendBadRequest(res, `Invalid changeType. Must be one of: ${validTypes.join(', ')}`);
      return;
    }

    try {
      const result = await inventoryRepository.updateVariantStock(variantId, {
        quantity: Number(quantity),
        changeType,
        source: source || 'MANUAL',
        reason,
        performedBy: req.user?.userId,
      });

      logger.info('Variant stock updated', {
        variantId,
        changeType,
        previousQuantity: result.previousQuantity,
        newQuantity: result.newQuantity,
      });

      sendSuccess(res, result, 'Variant stock updated successfully');
    } catch (error) {
      const err = error as Error;
      logger.error('Variant stock update failed', { variantId }, err);
      sendBadRequest(res, err.message);
    }
  },
);

export const deductStockForStoreSale: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { items, saleId, customerName, customerPhone, subtotal, tax, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      sendBadRequest(res, 'Items array is required');
      return;
    }

    try {
      const orderId = saleId || `store_sale_${Date.now()}`;
      await inventoryRepository.deductStockForOrder(items, orderId, 'STORE');

      sendSuccess(res, { orderId, customerName, customerPhone, subtotal, tax, total, itemCount: items.length }, 'Store sale completed successfully');
    } catch (error) {
      const err = error as Error;
      logger.error('Store sale deduction failed', undefined, err);
      sendBadRequest(res, err.message);
    }
  },
);

export const bulkUpdateStock: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      sendBadRequest(res, 'Updates array is required');
      return;
    }

    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        const result = await inventoryRepository.updateStock(update.productId, {
          quantity: Number(update.quantity),
          changeType: update.changeType || 'STOCK_ADJUSTED',
          source: 'IMPORT',
          reason: update.reason || 'Bulk update',
          performedBy: req.user?.userId,
        });
        results.push({ productId: update.productId, ...result });
      } catch (error) {
        errors.push({ productId: update.productId, error: (error as Error).message });
      }
    }

    sendSuccess(res, { results, errors, successCount: results.length, errorCount: errors.length });
  },
);
