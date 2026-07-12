import type { Request, RequestHandler, Response } from 'express';
import { salesBannerRepository } from '../repositories/sales-banner.repository';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getSalesBanners: RequestHandler = asyncHandler(
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
    };

    const result = await salesBannerRepository.findSalesBanners(
      page,
      limit,
      bannerFilters,
      { sortBy, sortOrder },
    );

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getActiveSalesBanners: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const banners = await salesBannerRepository.findActiveSalesBanners();
    sendSuccess(res, banners);
  },
);

export const getSalesBannerById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Sales banner ID is required');
      return;
    }

    const banner = await salesBannerRepository.findSalesBannerById(id);

    if (!banner) {
      sendNotFound(res, 'Sales banner not found');
      return;
    }

    sendSuccess(res, banner);
  },
);

export const createSalesBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, subtitle, image, buttonText, buttonUrl, isActive, order } = req.body;

    const banner = await salesBannerRepository.createSalesBanner({
      title,
      subtitle: subtitle || undefined,
      image,
      buttonText: buttonText || undefined,
      buttonUrl: buttonUrl || undefined,
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : 0,
    });

    sendCreated(res, banner, 'Sales banner created successfully');
  },
);

export const updateSalesBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Sales banner ID is required');
      return;
    }

    const exists = await salesBannerRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Sales banner not found');
      return;
    }

    const { title, subtitle, image, buttonText, buttonUrl, isActive, order } = req.body;
    const banner = await salesBannerRepository.updateSalesBanner(id, {
      title,
      subtitle: subtitle || undefined,
      image,
      buttonText: buttonText || undefined,
      buttonUrl: buttonUrl || undefined,
      isActive: isActive !== undefined ? isActive : undefined,
      order: order !== undefined ? order : undefined,
    });

    sendSuccess(res, banner, 'Sales banner updated successfully');
  },
);

export const deleteSalesBanner: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Sales banner ID is required');
      return;
    }

    const exists = await salesBannerRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Sales banner not found');
      return;
    }

    await salesBannerRepository.deleteSalesBanner(id);

    sendSuccess(res, null, 'Sales banner deleted successfully');
  },
);

export const toggleSalesBannerStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Sales banner ID is required');
      return;
    }

    try {
      const updated = await salesBannerRepository.toggleSalesBannerStatus(id);

      sendSuccess(
        res,
        updated,
        `Sales banner ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Sales banner not found');
    }
  },
);

export const reorderSalesBanners: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      sendBadRequest(res, 'Orders array is required');
      return;
    }

    await salesBannerRepository.reorderSalesBanners(orders);

    sendSuccess(res, null, 'Sales banners reordered successfully');
  },
);
