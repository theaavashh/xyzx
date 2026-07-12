import type { Request, RequestHandler, Response } from 'express';
import { bannerRepository } from '../repositories/banner.repository';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getBanners: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const bannerFilters = {
      search: filters.search,
      isActive:
        filters.isActive === 'true'
          ? true
          : filters.isActive === 'false'
            ? false
            : undefined,
      position: filters.position as string | undefined,
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
    const position = req.query.position as string | undefined;
    const banners = await bannerRepository.findActiveBanners(position);
    sendSuccess(res, banners);
  },
);

export const getBannerById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
    const { title, isActive, position, endDate, buttonText, buttonUrl, backgroundColor, textColor } = req.body;

    const banner = await bannerRepository.createBanner({
      title,
      isActive: isActive !== undefined ? isActive : true,
      position: position || 'top',
      endDate: endDate ? new Date(endDate) : undefined,
      buttonText,
      buttonUrl,
      backgroundColor,
      textColor,
    });

    sendCreated(res, banner, 'Banner created successfully');
  },
);

export const updateBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, isActive, position, endDate, buttonText, buttonUrl, backgroundColor, textColor } = req.body;

    if (!id) {
      sendBadRequest(res, 'Banner ID is required');
      return;
    }

    const exists = await bannerRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Banner not found');
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (position !== undefined) updateData.position = position;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (buttonText !== undefined) updateData.buttonText = buttonText;
    if (buttonUrl !== undefined) updateData.buttonUrl = buttonUrl;
    if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor;
    if (textColor !== undefined) updateData.textColor = textColor;

    const banner = await bannerRepository.updateBanner(id, updateData);

    sendSuccess(res, banner, 'Banner updated successfully');
  },
);

export const deleteBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Banner ID is required');
      return;
    }

    try {
      const updated = await bannerRepository.toggleBannerStatus(id);

      sendSuccess(
        res,
        updated,
        `Banner ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Banner not found');
    }
  },
);
