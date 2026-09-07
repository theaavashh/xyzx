import type { Request, RequestHandler, Response } from 'express';
import { storeLocationRepository } from '../repositories/store-location.repository';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getPublicStoreLocations: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const stores = await storeLocationRepository.findAllStoreLocations(false);
    sendSuccess(res, stores);
  },
);

export const getAllStoreLocations: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const stores = await storeLocationRepository.findAllStoreLocations(true);
    sendSuccess(res, stores);
  },
);

export const getStoreLocationById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      sendBadRequest(res, 'Store location ID is required');
      return;
    }
    const store = await storeLocationRepository.findStoreLocationById(id);
    if (!store) {
      sendNotFound(res, 'Store location not found');
      return;
    }
    sendSuccess(res, store);
  },
);

export const createStoreLocation: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, slug, address, city, state, zip, country, phone, email, image, mapEmbedUrl, hours, features, isActive, order } = req.body;
    const created = await storeLocationRepository.createStoreLocation({
      name,
      slug,
      address,
      city,
      state,
      zip,
      country: country ?? 'United States',
      phone,
      email,
      image,
      mapEmbedUrl,
      hours: hours ?? [],
      features: features ?? [],
      isActive: isActive ?? true,
      order: order ?? 0,
    });
    sendCreated(res, created, 'Store location created successfully');
  },
);

export const updateStoreLocation: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      sendBadRequest(res, 'Store location ID is required');
      return;
    }
    const exists = await storeLocationRepository.findStoreLocationById(id);
    if (!exists) {
      sendNotFound(res, 'Store location not found');
      return;
    }

    const { name, slug, address, city, state, zip, country, phone, email, image, mapEmbedUrl, hours, features, isActive, order } = req.body;
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zip !== undefined) updateData.zip = zip;
    if (country !== undefined) updateData.country = country;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (image !== undefined) updateData.image = image;
    if (mapEmbedUrl !== undefined) updateData.mapEmbedUrl = mapEmbedUrl;
    if (hours !== undefined) updateData.hours = hours;
    if (features !== undefined) updateData.features = features;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    const updated = await storeLocationRepository.updateStoreLocation(id, updateData);
    sendSuccess(res, updated, 'Store location updated successfully');
  },
);

export const deleteStoreLocation: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      sendBadRequest(res, 'Store location ID is required');
      return;
    }
    const exists = await storeLocationRepository.findStoreLocationById(id);
    if (!exists) {
      sendNotFound(res, 'Store location not found');
      return;
    }
    await storeLocationRepository.deleteStoreLocation(id);
    sendSuccess(res, null, 'Store location deleted successfully');
  },
);

export const toggleStoreLocationStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      sendBadRequest(res, 'Store location ID is required');
      return;
    }
    try {
      const updated = await storeLocationRepository.toggleStoreLocationStatus(id);
      sendSuccess(
        res,
        updated,
        `Store location ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Store location not found');
    }
  },
);
