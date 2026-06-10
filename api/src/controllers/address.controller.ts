import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getAddresses: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    sendSuccess(res, addresses);
  },
);

export const createAddress: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const { type, name, phone, street, city, state, zip, country, isDefault } =
      req.body;

    const data = {
      userId,
      type,
      name,
      phone,
      street,
      city,
      state: (state as string) || '',
      zip,
      country,
      isDefault: (isDefault as boolean) || false,
    };

    if (isDefault) {
      await prisma.$transaction([
        prisma.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        }),
        prisma.address.create({ data }),
      ]);

      const fresh = await prisma.address.findFirst({
        where: { userId, isDefault: true },
        orderBy: { createdAt: 'desc' },
      });
      sendCreated(res, fresh, 'Address created successfully');
      return;
    }

    const address = await prisma.address.create({ data });

    sendCreated(res, address, 'Address created successfully');
  },
);

export const updateAddress: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const addressId = req.params.id as string;

    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      sendNotFound(res, 'Address not found');
      return;
    }

    const { isDefault, ...rest } = req.body;

    if (isDefault === true) {
      const address = await prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
        return tx.address.update({
          where: { id: addressId },
          data: { ...rest, isDefault: true },
        });
      });
      sendSuccess(res, address, 'Address updated successfully');
      return;
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: { ...rest, ...(isDefault === false ? { isDefault: false } : {}) },
    });

    sendSuccess(res, address, 'Address updated successfully');
  },
);

export const deleteAddress: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const addressId = req.params.id as string;

    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      sendNotFound(res, 'Address not found');
      return;
    }

    await prisma.address.delete({ where: { id: addressId } });
    sendSuccess(res, null, 'Address deleted successfully');
  },
);

export const setDefaultAddress: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const addressId = req.params.id as string;

    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      sendNotFound(res, 'Address not found');
      return;
    }

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);

    sendSuccess(res, null, 'Default address set successfully');
  },
);
