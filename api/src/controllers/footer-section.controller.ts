import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getFooterSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sections = await prisma.footerSection.findMany({
      where: { isActive: true },
      include: { links: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });

    sendSuccess(res, sections);
  },
);

export const getAllFooterSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sections = await prisma.footerSection.findMany({
      include: { links: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });

    sendSuccess(res, sections);
  },
);

export const getFooterSectionById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const section = await prisma.footerSection.findUnique({
      where: { id },
      include: { links: { orderBy: { order: 'asc' } } },
    });

    if (!section) {
      sendNotFound(res, 'Footer section not found');
      return;
    }

    sendSuccess(res, section);
  },
);

export const createFooterSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, order, isActive, links } = req.body;

    const section = await prisma.footerSection.create({
      data: {
        title,
        order: order ?? 0,
        isActive: isActive ?? true,
        links: {
          create: links.map((link: { name: string; href: string; order: number }) => ({
            name: link.name,
            href: link.href,
            order: link.order,
          })),
        },
      },
      include: { links: true },
    });

    sendCreated(res, section, 'Footer section created successfully');
  },
);

export const updateFooterSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, order, isActive, links } = req.body;

    await prisma.footerSectionLink.deleteMany({ where: { sectionId: id } });

    const section = await prisma.footerSection.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(links !== undefined && {
          create: links.map((link: { name: string; href: string; order: number }) => ({
            name: link.name,
            href: link.href,
            order: link.order,
          })),
        }),
      },
      include: { links: true },
    });

    sendSuccess(res, section, 'Footer section updated successfully');
  },
);

export const deleteFooterSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await prisma.footerSection.delete({ where: { id } });

    sendSuccess(res, null, 'Footer section deleted successfully');
  },
);

export const toggleFooterSectionStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const section = await prisma.footerSection.findUnique({ where: { id } });

    if (!section) {
      sendNotFound(res, 'Footer section not found');
      return;
    }

    const updatedSection = await prisma.footerSection.update({
      where: { id },
      data: { isActive: !section.isActive },
    });

    sendSuccess(
      res,
      updatedSection,
      `Footer section ${updatedSection.isActive ? 'activated' : 'deactivated'} successfully`,
    );
  },
);

export const reorderFooterSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      sendBadRequest(res, 'Orders must be an array');
      return;
    }

    const updatePromises = orders.map(
      ({ id, order }: { id: string; order: number }) =>
        prisma.footerSection.update({ where: { id }, data: { order } }),
    );

    await prisma.$transaction(updatePromises);

    sendSuccess(res, null, 'Footer sections reordered successfully');
  },
);
