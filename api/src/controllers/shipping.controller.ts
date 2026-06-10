import type { Request, RequestHandler, Response } from 'express';
import type { ShippingItem } from '@prisma/client';
import { shippingRepository } from '../repositories/shipping.repository';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getPublicShipping: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const [items, settings] = await Promise.all([
      shippingRepository.findItems(),
      shippingRepository.getSettings(),
    ]);

    const grouped = {
      methods: items.filter((i: ShippingItem) => i.type === 'method'),
      info: items.filter((i: ShippingItem) => i.type === 'info'),
      regions: items.filter((i: ShippingItem) => i.type === 'region'),
    };

    sendSuccess(res, { items: grouped, settings });
  },
);

export const getShippingItems: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const type = req.query.type as string | undefined;
    const items = await shippingRepository.findItems(type, true);
    sendSuccess(res, items);
  },
);

export const getShippingItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
    const { type, name, title, region, description, price, time, order, isActive } = req.body;

    const newItem = await shippingRepository.createItem({
      type,
      name: name || null,
      title: title || null,
      region: region || null,
      description: description || null,
      price: price || null,
      time: time || null,
      order: order ?? 0,
      isActive: isActive ?? true,
    });

    sendCreated(res, newItem, 'Shipping item created successfully');
  },
);

export const updateShippingItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
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

    const { type, name, title, region, description, price, time, order, isActive } = req.body;

    const updateData: Record<string, unknown> = {};
    if (type !== undefined) updateData.type = type;
    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (region !== undefined) updateData.region = region;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (time !== undefined) updateData.time = time;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await shippingRepository.updateItem(id, updateData);

    sendSuccess(res, updated, 'Shipping item updated successfully');
  },
);

export const deleteShippingItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
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

export const toggleShippingItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Shipping item ID is required');
      return;
    }

    try {
      const updated = await shippingRepository.toggleItemStatus(id);

      sendSuccess(
        res,
        updated,
        `Shipping item ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Shipping item not found');
    }
  },
);

export const getSettings: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await shippingRepository.getSettings();
    sendSuccess(res, settings);
  },
);

export const updateSettings: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { freeShippingThreshold, freeInternationalThreshold, heroTitle, heroSubtitle } = req.body;

    const settings = await shippingRepository.getSettings();

    const updateData: Record<string, unknown> = {};
    if (freeShippingThreshold !== undefined) updateData.freeShippingThreshold = freeShippingThreshold;
    if (freeInternationalThreshold !== undefined) updateData.freeInternationalThreshold = freeInternationalThreshold;
    if (heroTitle !== undefined) updateData.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) updateData.heroSubtitle = heroSubtitle;

    const updated = await shippingRepository.updateSettings(settings.id, updateData);

    sendSuccess(res, updated, 'Shipping settings updated successfully');
  },
);
