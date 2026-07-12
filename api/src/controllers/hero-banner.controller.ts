import type { Request, RequestHandler, Response } from 'express';
import { heroBannerRepository } from '../repositories/hero-banner.repository';
import { triggerRevalidation } from '../utils/webhook';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getHeroBanners: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const heroBannerFilters = {
      search: filters.search,
      isActive:
        filters.isActive === 'true'
          ? true
          : filters.isActive === 'false'
            ? false
            : undefined,
    };

    const result = await heroBannerRepository.findHeroBanners(
      page,
      limit,
      heroBannerFilters,
      { sortBy, sortOrder },
    );

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getActiveHeroBanners: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const banners = await heroBannerRepository.findActiveHeroBanners();
    sendSuccess(res, banners);
  },
);

export const getHeroBannerById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Hero banner ID is required');
      return;
    }

    const banner = await heroBannerRepository.findHeroBannerById(id);

    if (!banner) {
      sendNotFound(res, 'Hero banner not found');
      return;
    }

    sendSuccess(res, banner);
  },
);

export const createHeroBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      subtitle,
      largeImage,
      smallImage,
      videoUrl,
      buttonUrl,
      buttonText,
      isActive,
      order,
    } = req.body;

    const banner = await heroBannerRepository.createHeroBanner({
      title,
      subtitle: subtitle || undefined,
      largeImage: largeImage || undefined,
      smallImage: smallImage || undefined,
      videoUrl: videoUrl || undefined,
      buttonUrl: buttonUrl || undefined,
      buttonText: buttonText || undefined,
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : 0,
    });

    sendCreated(res, banner, 'Hero banner created successfully');
    triggerRevalidation('hero-banners');
  },
);

export const updateHeroBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Hero banner ID is required');
      return;
    }

    const exists = await heroBannerRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Hero banner not found');
      return;
    }

    const { title, subtitle, largeImage, smallImage, videoUrl, buttonUrl, buttonText, isActive, order } = req.body;
    const banner = await heroBannerRepository.updateHeroBanner(id, {
      title,
      subtitle: subtitle || undefined,
      largeImage: largeImage || undefined,
      smallImage: smallImage || undefined,
      videoUrl: videoUrl || undefined,
      buttonUrl: buttonUrl || undefined,
      buttonText: buttonText || undefined,
      isActive: isActive !== undefined ? isActive : undefined,
      order: order !== undefined ? order : undefined,
    });

    sendSuccess(res, banner, 'Hero banner updated successfully');
    triggerRevalidation('hero-banners');
  },
);

export const deleteHeroBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Hero banner ID is required');
      return;
    }

    const exists = await heroBannerRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Hero banner not found');
      return;
    }

    await heroBannerRepository.deleteHeroBanner(id);

    sendSuccess(res, null, 'Hero banner deleted successfully');
    triggerRevalidation('hero-banners');
  },
);

export const toggleHeroBannerStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Hero banner ID is required');
      return;
    }

    try {
      const updated = await heroBannerRepository.toggleHeroBannerStatus(id);

      sendSuccess(
        res,
        updated,
        `Hero banner ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
      triggerRevalidation('hero-banners');
    } catch {
      sendNotFound(res, 'Hero banner not found');
    }
  },
);

export const reorderHeroBanners: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      sendBadRequest(res, 'Orders array is required');
      return;
    }

    await heroBannerRepository.reorderHeroBanners(orders);

    sendSuccess(res, null, 'Hero banners reordered successfully');
    triggerRevalidation('hero-banners');
  },
);
