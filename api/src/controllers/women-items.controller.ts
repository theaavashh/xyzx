import type { Request, RequestHandler, Response } from 'express';
import { womenItemsConfigRepository } from '../repositories/women-items.repository';
import { asyncHandler, sendSuccess } from '../utils';

const DEFAULT_CONFIG = {
  image: '',
  description: '',
  buttonTitle: 'View all',
  buttonCta: '/products',
  filterType: 'gender',
  filterValue: 'Women',
};

export const getWomenItemsConfig: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const config = await womenItemsConfigRepository.getWomenItemsConfig();
    sendSuccess(res, config ?? DEFAULT_CONFIG);
  },
);

export const updateWomenItemsConfig: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { image, description, buttonTitle, buttonCta, filterType, filterValue } =
      req.body;

    const updated = await womenItemsConfigRepository.upsertWomenItemsConfig({
      image,
      description,
      buttonTitle,
      buttonCta,
      filterType,
      filterValue,
    });

    sendSuccess(res, updated, 'Women Items updated successfully');
  },
);
