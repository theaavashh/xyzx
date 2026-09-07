import type { Request, RequestHandler, Response } from 'express';
import * as bannerRepo from '../repositories/promotional-banner.repository';
import { asyncHandler, parseQuery, sendBadRequest, sendCreated, sendNotFound, sendSuccess } from '../utils';

export const getPromotionalBanners: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, filters: rawFilters } = parseQuery(req);
  const filters: { search?: string; isActive?: boolean } = {};
  if (rawFilters.search) filters.search = rawFilters.search;
  if (rawFilters.isActive !== undefined) filters.isActive = rawFilters.isActive === 'true';
  const result = await bannerRepo.findPromotionalBanners(page, limit, filters);
  sendSuccess(res, result.data, undefined, 200, result.pagination);
});

export const getActivePromotionalBanners: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  const banners = await bannerRepo.findActivePromotionalBanners();
  sendSuccess(res, banners);
});

export const getPromotionalBannerById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const banner = await bannerRepo.findPromotionalBannerById(req.params.id as string);
  if (!banner) { sendNotFound(res, 'Promotional banner not found'); return; }
  sendSuccess(res, banner);
});

export const createPromotionalBanner: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const banner = await bannerRepo.createPromotionalBanner(req.body);
  sendCreated(res, banner);
});

export const updatePromotionalBanner: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const banner = await bannerRepo.updatePromotionalBanner(req.params.id as string, req.body);
  if (!banner) { sendNotFound(res, 'Promotional banner not found'); return; }
  sendSuccess(res, banner);
});

export const deletePromotionalBanner: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await bannerRepo.deletePromotionalBanner(req.params.id as string);
  if (!deleted) { sendNotFound(res, 'Promotional banner not found'); return; }
  sendSuccess(res, { message: 'Deleted successfully' });
});

export const togglePromotionalBannerStatus: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const banner = await bannerRepo.togglePromotionalBannerStatus(req.params.id as string);
  if (!banner) { sendNotFound(res, 'Promotional banner not found'); return; }
  sendSuccess(res, banner);
});
