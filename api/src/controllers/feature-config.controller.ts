import type { Request, RequestHandler, Response } from 'express';
import * as featureRepo from '../repositories/feature-config.repository';
import { asyncHandler, parseQuery, sendBadRequest, sendCreated, sendNotFound, sendSuccess } from '../utils';

export const getFeatureConfigs: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, filters: rawFilters } = parseQuery(req);
  const filters: { search?: string; isActive?: boolean } = {};
  if (rawFilters.search) filters.search = rawFilters.search;
  if (rawFilters.isActive !== undefined) filters.isActive = rawFilters.isActive === 'true';
  const result = await featureRepo.findFeatureConfigs(page, limit, filters);
  sendSuccess(res, result.data, undefined, 200, result.pagination);
});

export const getActiveFeatureConfigs: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  const configs = await featureRepo.findActiveFeatureConfigs();
  sendSuccess(res, configs);
});

export const getFeatureConfigById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const config = await featureRepo.findFeatureConfigById(req.params.id as string);
  if (!config) { sendNotFound(res, 'Feature config not found'); return; }
  sendSuccess(res, config);
});

export const createFeatureConfig: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const config = await featureRepo.createFeatureConfig(req.body);
  sendCreated(res, config);
});

export const updateFeatureConfig: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const config = await featureRepo.updateFeatureConfig(req.params.id as string, req.body);
  if (!config) { sendNotFound(res, 'Feature config not found'); return; }
  sendSuccess(res, config);
});

export const deleteFeatureConfig: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await featureRepo.deleteFeatureConfig(req.params.id as string);
  if (!deleted) { sendNotFound(res, 'Feature config not found'); return; }
  sendSuccess(res, { message: 'Deleted successfully' });
});

export const toggleFeatureConfigStatus: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const config = await featureRepo.toggleFeatureConfigStatus(req.params.id as string);
  if (!config) { sendNotFound(res, 'Feature config not found'); return; }
  sendSuccess(res, config);
});
