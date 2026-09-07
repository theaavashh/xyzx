import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getPublicContactPage: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await prisma.contactPageSettings.findFirst({
      where: { isActive: true },
    });
    sendSuccess(res, settings);
  },
);

export const getContactPage: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    let settings = await prisma.contactPageSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!settings) {
      settings = await prisma.contactPageSettings.create({
        data: {
          pageTitle: 'GET IN TOUCH WITH US',
          email: 'support@rapharch.com',
          phone: '+1 (212) 555-0189',
        },
      });
    }

    sendSuccess(res, settings);
  },
);

export const updateContactPage: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    let settings = await prisma.contactPageSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!settings) {
      settings = await prisma.contactPageSettings.create({
        data: req.body,
      });
      sendSuccess(res, settings, 'Contact page settings created');
      return;
    }

    const updated = await prisma.contactPageSettings.update({
      where: { id: settings.id },
      data: req.body,
    });

    sendSuccess(res, updated, 'Contact page settings updated');
  },
);
