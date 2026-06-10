import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getActiveShopByCategories: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const shopByCategories = await prisma.shopByCategory.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    sendSuccess(res, shopByCategories);
  },
);

export const getAllShopByCategories: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const shopByCategories = await prisma.shopByCategory.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    sendSuccess(res, shopByCategories);
  },
);

export const getShopByCategoryById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const shopByCategory = await prisma.shopByCategory.findUnique({ where: { id } });

    if (!shopByCategory) {
      sendNotFound(res, 'Shop by category not found');
      return;
    }

    sendSuccess(res, shopByCategory);
  },
);

export const createShopByCategory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, image, link, order, isActive } = req.body;

    const shopByCategory = await prisma.shopByCategory.create({
      data: {
        title,
        image,
        link,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    sendCreated(res, shopByCategory, 'Shop by category created successfully');
  },
);

export const updateShopByCategory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, image, link, order, isActive } = req.body;

    const shopByCategory = await prisma.shopByCategory.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(image !== undefined && { image }),
        ...(link !== undefined && { link }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    sendSuccess(res, shopByCategory, 'Shop by category updated successfully');
  },
);

export const deleteShopByCategory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await prisma.shopByCategory.delete({ where: { id } });

    sendSuccess(res, null, 'Shop by category deleted successfully');
  },
);

export const toggleShopByCategoryStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const shopByCategory = await prisma.shopByCategory.findUnique({ where: { id } });

    if (!shopByCategory) {
      sendNotFound(res, 'Shop by category not found');
      return;
    }

    const updated = await prisma.shopByCategory.update({
      where: { id },
      data: { isActive: !shopByCategory.isActive },
    });

    sendSuccess(
      res,
      updated,
      `Shop by category ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
    );
  },
);

export const reorderShopByCategories: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      sendBadRequest(res, 'Orders must be an array');
      return;
    }

    const updatePromises = orders.map(
      ({ id, order }: { id: string; order: number }) =>
        prisma.shopByCategory.update({ where: { id }, data: { order } }),
    );

    await prisma.$transaction(updatePromises);

    sendSuccess(res, null, 'Shop by categories reordered successfully');
  },
);
