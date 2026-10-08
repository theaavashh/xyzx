import type { Request, RequestHandler, Response } from 'express';
import { resolveShippingRepository } from '../di/index.js';
import { IShippingRepository } from '../interfaces/repositories/shipping.repository.js';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

export const getShippingItems: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const shippingRepository = await resolveShippingRepository();
    const type = req.query.type as string | undefined;
    const isAdmin = req.query.isAdmin === 'true';

    const items = await shippingRepository.findItems(type, isAdmin);
    sendSuccess(res, items);
  },
);

export const getShippingItemById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const shippingRepository = await resolveShippingRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Shipping item ID is required');
      return;
    }

    const item = await shippingRepository.findItemById(id);

    if (!item) {
      sendNotFound(res, 'Shipping item not found');
      return;
    }

    sendSuccess(res, item);
  },
);

export const createShippingItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const shippingRepository = await resolveShippingRepository();
    const data = req.body;

    const item = await shippingRepository.createItem(data);
    sendCreated(res, item, 'Shipping item created successfully');
  },
);

export const updateShippingItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const shippingRepository = await resolveShippingRepository();
    const id = req.params.id as string;
    const data = req.body;

    if (!id) {
      sendBadRequest(res, 'Shipping item ID is required');
      return;
    }

    const exists = await shippingRepository.findItemById(id);
    if (!exists) {
      sendNotFound(res, 'Shipping item not found');
      return;
    }

    const item = await shippingRepository.updateItem(id, data);
    sendSuccess(res, item, 'Shipping item updated successfully');
  },
);

export const deleteShippingItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const shippingRepository = await resolveShippingRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Shipping item ID is required');
      return;
    }

    const exists = await shippingRepository.findItemById(id);
    if (!exists) {
      sendNotFound(res, 'Shipping item not found');
      return;
    }

    await shippingRepository.deleteItem(id);
    sendSuccess(res, null, 'Shipping item deleted successfully');
  },
);

export const toggleShippingItemStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const shippingRepository = await resolveShippingRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Shipping item ID is required');
      return;
    }

    const item = await shippingRepository.toggleItemStatus(id);
    sendSuccess(res, item, `Shipping item ${item.isActive ? 'activated' : 'deactivated'} successfully`);
  },
);

export const getShippingSettings: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const shippingRepository = await resolveShippingRepository();
    const settings = await shippingRepository.getSettings();
    sendSuccess(res, settings);
  },
);

export const updateShippingSettings: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const shippingRepository = await resolveShippingRepository();
    const { id, ...data } = req.body;

    if (!id) {
      sendBadRequest(res, 'Settings ID is required');
      return;
    }

    const settings = await shippingRepository.updateSettings(id, data);
    sendSuccess(res, settings, 'Shipping settings updated successfully');
  },
);