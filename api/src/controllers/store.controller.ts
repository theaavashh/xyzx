import type { Prisma } from '@prisma/client';
import type { Request, RequestHandler, Response } from 'express';
import { storeRepository } from '../repositories/store.repository';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getPublicStore: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const store = await storeRepository.getStore();
    sendSuccess(res, store);
  },
);

export const getStore: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const store = await storeRepository.getStore();
    sendSuccess(res, store);
  },
);

export const updateStore: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    let store = await storeRepository.getStore();

    const fields = [
      'title', 'subtitle', 'description', 'address', 'city', 'state',
      'zip', 'country', 'phone', 'email', 'image', 'mapEmbedUrl',
      'ctaText', 'ctaUrl', 'hours', 'isActive',
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (!store) {
      store = await storeRepository.createStore({
        title: (updateData.title as string) || 'Visit Our Store',
        description: (updateData.description as string) || '',
        address: (updateData.address as string) || '',
        city: (updateData.city as string) || '',
        state: (updateData.state as string) || '',
        zip: (updateData.zip as string) || '',
        country: (updateData.country as string) || '',
        ...updateData,
      } as Prisma.StoreSectionCreateInput);
      sendCreated(res, store, 'Store section created successfully');
    } else {
      const updated = await storeRepository.updateStore(store.id, updateData);
      sendSuccess(res, updated, 'Store section updated successfully');
    }
  },
);

export const toggleStoreStatus: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const store = await storeRepository.getStore();

    if (!store) {
      sendNotFound(res, 'Store section not found');
      return;
    }

    try {
      const updated = await storeRepository.toggleStoreStatus(store.id);
      sendSuccess(
        res,
        updated,
        `Store section ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Store section not found');
    }
  },
);
