import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getNavigationItems: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const items = await prisma.navigationItem.findMany({
      where: { isActive: true },
      include: {
        columns: {
          include: { links: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    const transformedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      href: item.href,
      order: item.order,
      isActive: item.isActive,
      columns: item.columns.map((column) => ({
        id: column.id,
        title: column.title,
        href: column.href || `/w/${item.name.toLowerCase().replace(/\s+/g, '-')}/${column.title.toLowerCase().replace(/\s+/g, '-')}`,
        order: column.order,
        links: column.links.map((link) => ({ label: link.label, href: link.href })),
      })),
    }));

    sendSuccess(res, transformedItems);
  },
);

export const getAllNavigationItems: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const items = await prisma.navigationItem.findMany({
      include: {
        columns: {
          include: { links: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    sendSuccess(res, items);
  },
);

export const getNavigationItemById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const item = await prisma.navigationItem.findUnique({
      where: { id },
      include: {
        columns: {
          include: { links: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!item) {
      sendNotFound(res, 'Navigation item not found');
      return;
    }

    sendSuccess(res, item);
  },
);

export const createNavigationItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, href, order, isActive, columns } = req.body;

    const item = await prisma.navigationItem.create({
      data: {
        name,
        href,
        order: order ?? 0,
        isActive: isActive ?? true,
        columns: {
          create: columns.map((column: { title: string; href: string; order: number; links: { label: string; href: string; order: number }[] }) => ({
            title: column.title,
            href: column.href,
            order: column.order,
            links: {
              create: column.links.map((link: { label: string; href: string; order: number }) => ({
                label: link.label,
                href: link.href,
                order: link.order,
              })),
            },
          })),
        },
      },
      include: {
        columns: {
          include: { links: true },
        },
      },
    });

    sendCreated(res, item, 'Navigation item created successfully');
  },
);

export const updateNavigationItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, href, order, isActive, columns } = req.body;

    if (columns !== undefined) {
      await prisma.navigationLink.deleteMany({
        where: { column: { navigationItemId: id } },
      });

      await prisma.navigationColumn.deleteMany({
        where: { navigationItemId: id },
      });
    }

    const item = await prisma.navigationItem.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(href !== undefined && { href }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(columns !== undefined && {
          columns: {
            create: columns.map((column: { title: string; href: string; order: number; links: { label: string; href: string; order: number }[] }) => ({
              title: column.title,
              href: column.href,
              order: column.order,
              links: {
                create: column.links.map((link: { label: string; href: string; order: number }) => ({
                  label: link.label,
                  href: link.href,
                  order: link.order,
                })),
              },
            })),
          },
        }),
      },
      include: {
        columns: {
          include: { links: true },
        },
      },
    });

    sendSuccess(res, item, 'Navigation item updated successfully');
  },
);

export const deleteNavigationItem: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await prisma.navigationItem.delete({ where: { id } });

    sendSuccess(res, null, 'Navigation item deleted successfully');
  },
);

export const toggleNavigationItemStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const item = await prisma.navigationItem.findUnique({ where: { id } });

    if (!item) {
      sendNotFound(res, 'Navigation item not found');
      return;
    }

    const updatedItem = await prisma.navigationItem.update({
      where: { id },
      data: { isActive: !item.isActive },
    });

    sendSuccess(
      res,
      updatedItem,
      `Navigation item ${updatedItem.isActive ? 'activated' : 'deactivated'} successfully`,
    );
  },
);

export const reorderNavigationItems: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      sendBadRequest(res, 'Orders must be an array');
      return;
    }

    const updatePromises = orders.map(
      ({ id, order }: { id: string; order: number }) =>
        prisma.navigationItem.update({ where: { id }, data: { order } }),
    );

    await prisma.$transaction(updatePromises);

    sendSuccess(res, null, 'Navigation items reordered successfully');
  },
);
