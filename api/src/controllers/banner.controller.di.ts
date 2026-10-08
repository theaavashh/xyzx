import type { Request, RequestHandler, Response } from 'express';
import { resolveBannerRepository } from '../di/index.js';
import { IBannerRepository } from '../interfaces/repositories/banner.repository.js';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

export const getBanners: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const bannerRepository = await resolveBannerRepository();
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const bannerFilters = {
      search: filters.search,
      isActive: filters.isActive ? filters.isActive === 'true' : undefined,
      position: filters.position,
    };

    const result = await bannerRepository.findBanners(page, limit, bannerFilters, {
      sortBy,
      sortOrder,
    });

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getActiveBanners: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const bannerRepository = await resolveBannerRepository();
    const position = req.query.position as string | undefined;
    const banners = await bannerRepository.findActiveBanners(position);
    sendSuccess(res, banners);
  },
);

export const getBannerById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const bannerRepository = await resolveBannerRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Banner ID is required');
      return;
    }

    const banner = await bannerRepository.findBannerById(id);

    if (!banner) {
      sendNotFound(res, 'Banner not found');
      return;
    }

    sendSuccess(res, banner);
  },
);

export const createBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const bannerRepository = await resolveBannerRepository();
    const bannerData = req.body;

    const banner = await bannerRepository.createBanner(bannerData);
    sendCreated(res, banner, 'Banner created successfully');
  },
);

export const updateBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const bannerRepository = await resolveBannerRepository();
    const id = req.params.id as string;
    const bannerData = req.body;

    if (!id) {
      sendBadRequest(res, 'Banner ID is required');
      return;
    }

    const exists = await bannerRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Banner not found');
      return;
    }

    const banner = await bannerRepository.updateBanner(id, bannerData);
    sendSuccess(res, banner, 'Banner updated successfully');
  },
);

export const deleteBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const bannerRepository = await resolveBannerRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Banner ID is required');
      return;
    }

    const exists = await bannerRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Banner not found');
      return;
    }

    await bannerRepository.deleteBanner(id);
    sendSuccess(res, null, 'Banner deleted successfully');
  },
);

export const toggleBannerStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const bannerRepository = await resolveBannerRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Banner ID is required');
      return;
    }

    const banner = await bannerRepository.toggleBannerStatus(id);
    sendSuccess(res, banner, `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`);
  },
);