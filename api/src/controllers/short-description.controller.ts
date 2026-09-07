import type { Request, RequestHandler, Response } from 'express';
import { shortDescriptionRepository } from '../repositories/short-description.repository';
import { asyncHandler, sendSuccess } from '../utils';

export const getShortDescription: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await shortDescriptionRepository.getShortDescription();
    sendSuccess(res, { description: data?.description ?? '' });
  },
);

export const updateShortDescription: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { description } = req.body;

    const updated = await shortDescriptionRepository.upsertShortDescription(
      description ?? '',
    );

    sendSuccess(res, { description: updated.description }, 'Short description updated successfully');
  },
);
