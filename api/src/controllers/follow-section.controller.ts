import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getFollowSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const section = await prisma.followSection.findFirst({
      where: { isActive: true },
      include: {
        socialLinks: { where: { isActive: true }, orderBy: { order: 'asc' } },
      },
    });

    sendSuccess(res, section);
  },
);

export const getAllFollowSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sections = await prisma.followSection.findMany({
      include: {
        socialLinks: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    sendSuccess(res, sections);
  },
);

export const getFollowSectionById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const section = await prisma.followSection.findUnique({
      where: { id },
      include: {
        socialLinks: { orderBy: { order: 'asc' } },
      },
    });

    if (!section) {
      sendNotFound(res, 'Follow section not found');
      return;
    }

    sendSuccess(res, section);
  },
);

export const createFollowSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      copyrightText, designerCredit, showPaymentIcons,
      isActive, socialLinks,
    } = req.body;

    const section = await prisma.followSection.create({
      data: {
        copyrightText, designerCredit, showPaymentIcons,
        isActive: isActive ?? true,
        socialLinks: {
          create: (socialLinks || []).map((link: { name: string; url: string; icon: string; ariaLabel?: string; order?: number; isActive?: boolean }) => ({
            name: link.name, url: link.url, icon: link.icon,
            ariaLabel: link.ariaLabel || '',
            order: link.order ?? 0, isActive: link.isActive ?? true,
          })),
        },
      },
      include: { socialLinks: true },
    });

    sendCreated(res, section, 'Follow section created successfully');
  },
);

export const updateFollowSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const {
      copyrightText, designerCredit, showPaymentIcons,
      isActive, socialLinks,
    } = req.body;

    await prisma.followSocialLink.deleteMany({ where: { followSectionId: id } });

    const section = await prisma.followSection.update({
      where: { id },
      data: {
        ...(copyrightText !== undefined && { copyrightText }),
        ...(designerCredit !== undefined && { designerCredit }),
        ...(showPaymentIcons !== undefined && { showPaymentIcons }),
        ...(isActive !== undefined && { isActive }),
        ...(socialLinks !== undefined && {
          socialLinks: {
            create: socialLinks.map((link: { name: string; url: string; icon: string; ariaLabel?: string; order?: number; isActive?: boolean }) => ({
              name: link.name, url: link.url, icon: link.icon,
              ariaLabel: link.ariaLabel || '',
              order: link.order ?? 0, isActive: link.isActive ?? true,
            })),
          },
        }),
      },
      include: { socialLinks: true },
    });

    sendSuccess(res, section, 'Follow section updated successfully');
  },
);

export const deleteFollowSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await prisma.followSection.delete({ where: { id } });

    sendSuccess(res, null, 'Follow section deleted successfully');
  },
);

export const toggleFollowSectionStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const section = await prisma.followSection.findUnique({ where: { id } });

    if (!section) {
      sendNotFound(res, 'Follow section not found');
      return;
    }

    const updatedSection = await prisma.followSection.update({
      where: { id },
      data: { isActive: !section.isActive },
    });

    sendSuccess(
      res,
      updatedSection,
      `Follow section ${updatedSection.isActive ? 'activated' : 'deactivated'} successfully`,
    );
  },
);
