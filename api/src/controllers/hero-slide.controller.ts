import type { Request, RequestHandler, Response } from 'express';
import { heroSlideRepository } from '../repositories/hero-slide.repository';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getActiveHeroSlides: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const items = await heroSlideRepository.findActiveHeroSlides();
    sendSuccess(res, items);
  },
);

export const getAllHeroSlides: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const items = await heroSlideRepository.findAllHeroSlides();
    sendSuccess(res, items);
  },
);

export const getHeroSlideById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const item = await heroSlideRepository.findHeroSlideById(id);
    if (!item) {
      sendNotFound(res, 'Hero slide not found');
      return;
    }
    sendSuccess(res, item);
  },
);

export const createHeroSlide: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, subtitle, image, imageMobile, order, isActive } = req.body;
    const item = await heroSlideRepository.createHeroSlide({
      title,
      subtitle,
      image,
      imageMobile,
      order: order ?? 0,
      isActive: isActive ?? true,
    });
    sendCreated(res, item, 'Hero slide created successfully');
  },
);

export const updateHeroSlide: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, subtitle, image, imageMobile, order, isActive } = req.body;

    const exists = await heroSlideRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Hero slide not found');
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (image !== undefined) updateData.image = image;
    if (imageMobile !== undefined) updateData.imageMobile = imageMobile;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const item = await heroSlideRepository.updateHeroSlide(id, updateData);
    sendSuccess(res, item, 'Hero slide updated successfully');
  },
);

export const deleteHeroSlide: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const exists = await heroSlideRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Hero slide not found');
      return;
    }
    await heroSlideRepository.deleteHeroSlide(id);
    sendSuccess(res, null, 'Hero slide deleted successfully');
  },
);

export const toggleHeroSlideStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
      const updated = await heroSlideRepository.toggleHeroSlideStatus(id);
      sendSuccess(
        res,
        updated,
        `Hero slide ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Hero slide not found');
    }
  },
);

export const reorderHeroSlides: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      sendBadRequest(res, 'Orders must be an array');
      return;
    }
    await heroSlideRepository.reorderHeroSlides(orders);
    sendSuccess(res, null, 'Hero slides reordered successfully');
  },
);
