import type { Request, RequestHandler, Response } from 'express';
import { imageGridRepository } from '../repositories/image-grid.repository';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getActiveImageGridItems: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const items = await imageGridRepository.findActiveImageGridItems();
    sendSuccess(res, items);
  },
);

export const getAllImageGridItems: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const items = await imageGridRepository.findAllImageGridItems();
    sendSuccess(res, items);
  },
);

export const getImageGridItemById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const item = await imageGridRepository.findImageGridItemById(id);
    if (!item) {
      sendNotFound(res, 'Image grid item not found');
      return;
    }
    sendSuccess(res, item);
  },
);

export const createImageGridItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { src, title, subtitle, link, order, isActive } = req.body;
    const item = await imageGridRepository.createImageGridItem({
      src,
      title,
      subtitle,
      link,
      order: order ?? 0,
      isActive: isActive ?? true,
    });
    sendCreated(res, item, 'Image grid item created successfully');
  },
);

export const updateImageGridItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { src, title, subtitle, link, order, isActive } = req.body;

    const exists = await imageGridRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Image grid item not found');
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (src !== undefined) updateData.src = src;
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (link !== undefined) updateData.link = link;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const item = await imageGridRepository.updateImageGridItem(id, updateData);
    sendSuccess(res, item, 'Image grid item updated successfully');
  },
);

export const deleteImageGridItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const exists = await imageGridRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Image grid item not found');
      return;
    }
    await imageGridRepository.deleteImageGridItem(id);
    sendSuccess(res, null, 'Image grid item deleted successfully');
  },
);

export const toggleImageGridItemStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
      const updated = await imageGridRepository.toggleImageGridItemStatus(id);
      sendSuccess(
        res,
        updated,
        `Image grid item ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Image grid item not found');
    }
  },
);

export const reorderImageGridItems: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      sendBadRequest(res, 'Orders must be an array');
      return;
    }
    await imageGridRepository.reorderImageGridItems(orders);
    sendSuccess(res, null, 'Image grid items reordered successfully');
  },
);
