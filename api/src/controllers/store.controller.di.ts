import type { Request, RequestHandler, Response } from 'express';
import { resolveStoreRepository } from '../di/index.js';
import { IStoreRepository } from '../interfaces/repositories/store.repository.js';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

export const getStore: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const storeRepository = await resolveStoreRepository();
    const store = await storeRepository.getStore();
    sendSuccess(res, store);
  },
);

export const createStore: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const storeRepository = await resolveStoreRepository();
    const storeData = req.body;

    const store = await storeRepository.createStore(storeData);
    sendCreated(res, store, 'Store section created successfully');
  },
);

export const updateStore: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const storeRepository = await resolveStoreRepository();
    const id = req.params.id as string;
    const storeData = req.body;

    if (!id) {
      sendBadRequest(res, 'Store ID is required');
      return;
    }

    const store = await storeRepository.updateStore(id, storeData);
    sendSuccess(res, store, 'Store section updated successfully');
  },
);

export const toggleStoreStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const storeRepository = await resolveStoreRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Store ID is required');
      return;
    }

    const store = await storeRepository.toggleStoreStatus(id);
    sendSuccess(res, store, `Store section ${store.isActive ? 'activated' : 'deactivated'} successfully`);
  },
);