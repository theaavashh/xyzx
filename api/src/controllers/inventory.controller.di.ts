import type { Request, RequestHandler, Response } from 'express';
import { resolveInventoryRepository } from '../di/index.js';
import { IInventoryRepository } from '../interfaces/repositories/inventory.repository.js';
import {
  asyncHandler,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

export const getStock: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const inventoryRepository = await resolveInventoryRepository();
    const productId = req.params.productId as string;

    if (!productId) {
      sendBadRequest(res, 'Product ID is required');
      return;
    }

    const stock = await inventoryRepository.getStock(productId);
    sendSuccess(res, { productId, quantity: stock });
  },
);

export const updateStock: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const inventoryRepository = await resolveInventoryRepository();
    const productId = req.params.productId as string;
    const data = req.body;

    if (!productId) {
      sendBadRequest(res, 'Product ID is required');
      return;
    }

    if (!data.quantity || !data.changeType) {
      sendBadRequest(res, 'Quantity and changeType are required');
      return;
    }

    const result = await inventoryRepository.updateStock(productId, data);
    sendSuccess(res, result, 'Stock updated successfully');
  },
);

export const deductStockForOrder: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const inventoryRepository = await resolveInventoryRepository();
    const { items, orderId, source } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      sendBadRequest(res, 'Items array is required');
      return;
    }

    if (!orderId) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    const result = await inventoryRepository.deductStockForOrder(items, orderId, source || 'ONLINE');
    
    if (!result.success) {
      sendBadRequest(res, `Insufficient stock for product: ${result.failedItem}`);
      return;
    }

    sendSuccess(res, result, 'Stock deducted successfully');
  },
);

export const restoreStockForOrder: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const inventoryRepository = await resolveInventoryRepository();
    const { items, orderId, reason } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      sendBadRequest(res, 'Items array is required');
      return;
    }

    if (!orderId) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    await inventoryRepository.restoreStockForOrder(items, orderId, reason);
    sendSuccess(res, null, 'Stock restored successfully');
  },
);

export const getInventoryLogs: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const inventoryRepository = await resolveInventoryRepository();
    const productId = req.query.productId as string | undefined;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const page = Math.floor(offset / limit) + 1;

    const result = await inventoryRepository.getInventoryLogs(productId, limit, offset);
    sendSuccess(res, result.logs, undefined, 200, { 
      total: result.total, 
      limit, 
      page, 
      pages: Math.ceil(result.total / limit) 
    });
  },
);

export const getLowStockProducts: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const inventoryRepository = await resolveInventoryRepository();
    const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : undefined;

    const products = await inventoryRepository.getLowStockProducts(threshold);
    sendSuccess(res, products);
  },
);

export const getInventoryStats: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const inventoryRepository = await resolveInventoryRepository();
    const stats = await inventoryRepository.getInventoryStats();
    sendSuccess(res, stats);
  },
);

export const getVariantInventory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const inventoryRepository = await resolveInventoryRepository();
    const variants = await inventoryRepository.getVariantInventory();
    sendSuccess(res, variants);
  },
);

export const updateVariantStock: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const inventoryRepository = await resolveInventoryRepository();
    const variantId = req.params.variantId as string;
    const data = req.body;

    if (!variantId) {
      sendBadRequest(res, 'Variant ID is required');
      return;
    }

    if (!data.quantity || !data.changeType) {
      sendBadRequest(res, 'Quantity and changeType are required');
      return;
    }

    const result = await inventoryRepository.updateVariantStock(variantId, data);
    sendSuccess(res, result, 'Variant stock updated successfully');
  },
);