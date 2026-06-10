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
        serviceItems: { where: { isActive: true }, orderBy: { order: 'asc' } },
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
        serviceItems: { orderBy: { order: 'asc' } },
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
        serviceItems: { orderBy: { order: 'asc' } },
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
      brandName, street, city, state, zip, country,
      copyrightText, designerCredit, showPaymentIcons,
      isActive, serviceItems, socialLinks,
    } = req.body;

    const section = await prisma.followSection.create({
      data: {
        brandName, street, city, state, zip, country,
        copyrightText, designerCredit, showPaymentIcons,
        isActive: isActive ?? true,
        serviceItems: {
          create: (serviceItems || []).map((item: { title: string; description: string; image: string; order: number; isActive: boolean }) => ({
            title: item.title, description: item.description, image: item.image,
            order: item.order ?? 0, isActive: item.isActive ?? true,
          })),
        },
        socialLinks: {
          create: (socialLinks || []).map((link: { name: string; url: string; icon: string; ariaLabel: string; order: number; isActive: boolean }) => ({
            name: link.name, url: link.url, icon: link.icon, ariaLabel: link.ariaLabel,
            order: link.order ?? 0, isActive: link.isActive ?? true,
          })),
        },
      },
      include: { serviceItems: true, socialLinks: true },
    });

    sendCreated(res, section, 'Follow section created successfully');
  },
);

export const updateFollowSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const {
      brandName, street, city, state, zip, country,
      copyrightText, designerCredit, showPaymentIcons,
      isActive, serviceItems, socialLinks,
    } = req.body;

    await prisma.followServiceItem.deleteMany({ where: { followSectionId: id } });
    await prisma.followSocialLink.deleteMany({ where: { followSectionId: id } });

    const section = await prisma.followSection.update({
      where: { id },
      data: {
        ...(brandName !== undefined && { brandName }),
        ...(street !== undefined && { street }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(zip !== undefined && { zip }),
        ...(country !== undefined && { country }),
        ...(copyrightText !== undefined && { copyrightText }),
        ...(designerCredit !== undefined && { designerCredit }),
        ...(showPaymentIcons !== undefined && { showPaymentIcons }),
        ...(isActive !== undefined && { isActive }),
        ...(serviceItems !== undefined && serviceItems.length > 0 && {
          create: serviceItems.map((item: { title: string; description: string; image: string; order: number; isActive: boolean }) => ({
            title: item.title, description: item.description, image: item.image,
            order: item.order ?? 0, isActive: item.isActive ?? true,
          })),
        }),
        ...(socialLinks !== undefined && socialLinks.length > 0 && {
          create: socialLinks.map((link: { name: string; url: string; icon: string; ariaLabel: string; order: number; isActive: boolean }) => ({
            name: link.name, url: link.url, icon: link.icon, ariaLabel: link.ariaLabel,
            order: link.order ?? 0, isActive: link.isActive ?? true,
          })),
        }),
      },
      include: { serviceItems: true, socialLinks: true },
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
