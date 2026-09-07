import type { Request, RequestHandler, Response } from 'express';
import { categoryTileGridRepository } from '../repositories/category-tile-grid.repository';
import {
  asyncHandler,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getActiveCategoryTileGridSections: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const sections = await categoryTileGridRepository.findActiveCategoryTileGridSections();
    sendSuccess(res, sections);
  },
);

export const getAllCategoryTileGridSections: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const sections = await categoryTileGridRepository.findAllCategoryTileGridSections();
    sendSuccess(res, sections);
  },
);

export const getCategoryTileGridSectionById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const section = await categoryTileGridRepository.findCategoryTileGridSectionById(id);
    if (!section) {
      sendNotFound(res, 'Category tile grid section not found');
      return;
    }
    sendSuccess(res, section);
  },
);

export const createCategoryTileGridSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { isActive, order, items } = req.body;
    const section = await categoryTileGridRepository.createCategoryTileGridSection({
      isActive,
      order,
      items: items || [],
    });
    sendCreated(res, section, 'Category tile grid section created successfully');
  },
);

export const updateCategoryTileGridSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const exists = await categoryTileGridRepository.findCategoryTileGridSectionById(id);
    if (!exists) {
      sendNotFound(res, 'Category tile grid section not found');
      return;
    }

    const { isActive, order, items } = req.body;
    const section = await categoryTileGridRepository.updateCategoryTileGridSection(id, {
      isActive,
      order,
      items,
    });
    sendSuccess(res, section, 'Category tile grid section updated successfully');
  },
);

export const deleteCategoryTileGridSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const exists = await categoryTileGridRepository.findCategoryTileGridSectionById(id);
    if (!exists) {
      sendNotFound(res, 'Category tile grid section not found');
      return;
    }
    await categoryTileGridRepository.deleteCategoryTileGridSection(id);
    sendSuccess(res, null, 'Category tile grid section deleted successfully');
  },
);

export const toggleCategoryTileGridSectionStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
      const updated = await categoryTileGridRepository.toggleCategoryTileGridSectionStatus(id);
      sendSuccess(
        res,
        updated,
        `Category tile grid section ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Category tile grid section not found');
    }
  },
);
