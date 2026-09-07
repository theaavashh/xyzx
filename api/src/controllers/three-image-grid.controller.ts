import type { Request, RequestHandler, Response } from 'express';
import { threeImageGridRepository } from '../repositories/three-image-grid.repository';
import {
  asyncHandler,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getActiveThreeImageGridSections: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const sections = await threeImageGridRepository.findActiveThreeImageGridSections();
    sendSuccess(res, sections);
  },
);

export const getAllThreeImageGridSections: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const sections = await threeImageGridRepository.findAllThreeImageGridSections();
    sendSuccess(res, sections);
  },
);

export const getThreeImageGridSectionById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const section = await threeImageGridRepository.findThreeImageGridSectionById(id);
    if (!section) {
      sendNotFound(res, 'Three image grid section not found');
      return;
    }
    sendSuccess(res, section);
  },
);

export const createThreeImageGridSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { isActive, order, columns } = req.body;
    const section = await threeImageGridRepository.createThreeImageGridSection({
      isActive,
      order,
      columns: columns || [],
    });
    sendCreated(res, section, 'Three image grid section created successfully');
  },
);

export const updateThreeImageGridSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const exists = await threeImageGridRepository.findThreeImageGridSectionById(id);
    if (!exists) {
      sendNotFound(res, 'Three image grid section not found');
      return;
    }

    const { isActive, order, columns } = req.body;
    const section = await threeImageGridRepository.updateThreeImageGridSection(id, {
      isActive,
      order,
      columns,
    });
    sendSuccess(res, section, 'Three image grid section updated successfully');
  },
);

export const deleteThreeImageGridSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const exists = await threeImageGridRepository.findThreeImageGridSectionById(id);
    if (!exists) {
      sendNotFound(res, 'Three image grid section not found');
      return;
    }
    await threeImageGridRepository.deleteThreeImageGridSection(id);
    sendSuccess(res, null, 'Three image grid section deleted successfully');
  },
);

export const toggleThreeImageGridSectionStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
      const updated = await threeImageGridRepository.toggleThreeImageGridSectionStatus(id);
      sendSuccess(
        res,
        updated,
        `Three image grid section ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Three image grid section not found');
    }
  },
);
