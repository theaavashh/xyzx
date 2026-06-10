import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getFooterCatalogs: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const catalogs = await prisma.footerCatalog.findMany({
      where: { isActive: true },
      include: { links: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });

    sendSuccess(res, catalogs);
  },
);

export const getAllFooterCatalogs: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const catalogs = await prisma.footerCatalog.findMany({
      include: { links: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });

    sendSuccess(res, catalogs);
  },
);

export const getFooterCatalogById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const catalog = await prisma.footerCatalog.findUnique({
      where: { id },
      include: { links: { orderBy: { order: 'asc' } } },
    });

    if (!catalog) {
      sendNotFound(res, 'Footer catalog not found');
      return;
    }

    sendSuccess(res, catalog);
  },
);

export const createFooterCatalog: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, href, order, isActive, links } = req.body;

    const catalog = await prisma.footerCatalog.create({
      data: {
        title,
        href: href ?? '',
        order: order ?? 0,
        isActive: isActive ?? true,
        links: {
          create: links.map((link: { label: string; href: string; order: number }) => ({
            label: link.label,
            href: link.href,
            order: link.order,
          })),
        },
      },
      include: { links: true },
    });

    sendCreated(res, catalog, 'Footer catalog created successfully');
  },
);

export const updateFooterCatalog: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, href, order, isActive, links } = req.body;

    await prisma.footerCatalogLink.deleteMany({ where: { catalogId: id } });

    const catalog = await prisma.footerCatalog.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(href !== undefined && { href }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(links !== undefined && {
          create: links.map((link: { label: string; href: string; order: number }) => ({
            label: link.label,
            href: link.href,
            order: link.order,
          })),
        }),
      },
      include: { links: true },
    });

    sendSuccess(res, catalog, 'Footer catalog updated successfully');
  },
);

export const deleteFooterCatalog: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await prisma.footerCatalog.delete({ where: { id } });

    sendSuccess(res, null, 'Footer catalog deleted successfully');
  },
);

export const toggleFooterCatalogStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const catalog = await prisma.footerCatalog.findUnique({ where: { id } });

    if (!catalog) {
      sendNotFound(res, 'Footer catalog not found');
      return;
    }

    const updatedCatalog = await prisma.footerCatalog.update({
      where: { id },
      data: { isActive: !catalog.isActive },
    });

    sendSuccess(
      res,
      updatedCatalog,
      `Footer catalog ${updatedCatalog.isActive ? 'activated' : 'deactivated'} successfully`,
    );
  },
);

export const reorderFooterCatalogs: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      sendBadRequest(res, 'Orders must be an array');
      return;
    }

    const updatePromises = orders.map(
      ({ id, order }: { id: string; order: number }) =>
        prisma.footerCatalog.update({ where: { id }, data: { order } }),
    );

    await prisma.$transaction(updatePromises);

    sendSuccess(res, null, 'Footer catalogs reordered successfully');
  },
);
