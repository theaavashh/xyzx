import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getActiveAboutSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const section = await prisma.aboutSection.findFirst({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    sendSuccess(res, section);
  },
);

export const getAllAboutSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sections = await prisma.aboutSection.findMany({
      orderBy: { order: 'asc' },
    });
    sendSuccess(res, sections);
  },
);

export const getAboutSectionById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const section = await prisma.aboutSection.findUnique({ where: { id } });

    if (!section) {
      sendNotFound(res, 'About section not found');
      return;
    }

    sendSuccess(res, section);
  },
);

export const createAboutSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { quote, ctaText, ctaUrl, isActive, order } = req.body;

    const section = await prisma.aboutSection.create({
      data: {
        quote,
        ctaText: ctaText ?? 'More About Us',
        ctaUrl: ctaUrl ?? '/about',
        isActive: isActive ?? true,
        order: order ?? 0,
      },
    });

    sendCreated(res, section, 'About section created successfully');
  },
);

export const updateAboutSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { quote, ctaText, ctaUrl, isActive, order } = req.body;

    const existing = await prisma.aboutSection.findUnique({ where: { id } });

    if (!existing) {
      sendNotFound(res, 'About section not found');
      return;
    }

    const section = await prisma.aboutSection.update({
      where: { id },
      data: {
        ...(quote !== undefined && { quote }),
        ...(ctaText !== undefined && { ctaText }),
        ...(ctaUrl !== undefined && { ctaUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    });

    sendSuccess(res, section, 'About section updated successfully');
  },
);

export const deleteAboutSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const existing = await prisma.aboutSection.findUnique({ where: { id } });

    if (!existing) {
      sendNotFound(res, 'About section not found');
      return;
    }

    await prisma.aboutSection.delete({ where: { id } });

    sendSuccess(res, null, 'About section deleted successfully');
  },
);

export const toggleAboutSectionStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const section = await prisma.aboutSection.findUnique({ where: { id } });

    if (!section) {
      sendNotFound(res, 'About section not found');
      return;
    }

    const updated = await prisma.aboutSection.update({
      where: { id },
      data: { isActive: !section.isActive },
    });

    sendSuccess(
      res,
      updated,
      `About section ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
    );
  },
);
