import type { Request, RequestHandler, Response } from 'express';
import { categoryGridRepository } from '../repositories/category-grid.repository';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getActiveCategoryGridItems: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const items = await categoryGridRepository.findActiveCategoryGridItems();
    sendSuccess(res, items);
  },
);

export const getAllCategoryGridItems: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const items = await categoryGridRepository.findAllCategoryGridItems();
    sendSuccess(res, items);
  },
);

export const getCategoryGridItemById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const item = await categoryGridRepository.findCategoryGridItemById(id);
    if (!item) {
      sendNotFound(res, 'Category grid item not found');
      return;
    }
    sendSuccess(res, item);
  },
);

export const createCategoryGridItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, subtitle, image, link, alt, order, isActive } = req.body;
    const item = await categoryGridRepository.createCategoryGridItem({
      title,
      subtitle,
      image,
      link,
      alt,
      order: order ?? 0,
      isActive: isActive ?? true,
    });
    sendCreated(res, item, 'Category grid item created successfully');
  },
);

export const updateCategoryGridItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, subtitle, image, link, alt, order, isActive } = req.body;

    const exists = await categoryGridRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Category grid item not found');
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (image !== undefined) updateData.image = image;
    if (link !== undefined) updateData.link = link;
    if (alt !== undefined) updateData.alt = alt;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const item = await categoryGridRepository.updateCategoryGridItem(id, updateData);
    sendSuccess(res, item, 'Category grid item updated successfully');
  },
);

export const deleteCategoryGridItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const exists = await categoryGridRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Category grid item not found');
      return;
    }
    await categoryGridRepository.deleteCategoryGridItem(id);
    sendSuccess(res, null, 'Category grid item deleted successfully');
  },
);

export const toggleCategoryGridItemStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
      const updated = await categoryGridRepository.toggleCategoryGridItemStatus(id);
      sendSuccess(
        res,
        updated,
        `Category grid item ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Category grid item not found');
    }
  },
);

export const reorderCategoryGridItems: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      sendBadRequest(res, 'Orders must be an array');
      return;
    }
    await categoryGridRepository.reorderCategoryGridItems(orders);
    sendSuccess(res, null, 'Category grid items reordered successfully');
  },
);
