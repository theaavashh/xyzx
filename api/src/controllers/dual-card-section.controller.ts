import type { Request, RequestHandler, Response } from 'express';
import { dualCardSectionRepository } from '../repositories/dual-card-section.repository';
import { triggerRevalidation } from '../utils/webhook';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getDualCardSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const sectionFilters = {
      isActive:
        filters.isActive === 'true'
          ? true
          : filters.isActive === 'false'
            ? false
            : undefined,
    };

    const result = await dualCardSectionRepository.findDualCardSections(
      page,
      limit,
      sectionFilters,
      { sortBy, sortOrder },
    );

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getActiveDualCardSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sections = await dualCardSectionRepository.findActiveDualCardSections();
    sendSuccess(res, sections);
  },
);

export const getDualCardSectionById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Dual card section ID is required');
      return;
    }

    const section = await dualCardSectionRepository.findDualCardSectionById(id);

    if (!section) {
      sendNotFound(res, 'Dual card section not found');
      return;
    }

    sendSuccess(res, section);
  },
);

export const createDualCardSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { cards, isActive, order } = req.body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      sendBadRequest(res, 'At least one card is required');
      return;
    }

    const section = await dualCardSectionRepository.createDualCardSection({
      cards,
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : 0,
    });

    sendCreated(res, section, 'Dual card section created successfully');
    triggerRevalidation('dual-card-sections');
  },
);

export const updateDualCardSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Dual card section ID is required');
      return;
    }

    const exists = await dualCardSectionRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Dual card section not found');
      return;
    }

    const { cards, isActive, order } = req.body;
    const section = await dualCardSectionRepository.updateDualCardSection(id, {
      cards: cards || undefined,
      isActive: isActive !== undefined ? isActive : undefined,
      order: order !== undefined ? order : undefined,
    });

    sendSuccess(res, section, 'Dual card section updated successfully');
    triggerRevalidation('dual-card-sections');
  },
);

export const deleteDualCardSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Dual card section ID is required');
      return;
    }

    const exists = await dualCardSectionRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Dual card section not found');
      return;
    }

    await dualCardSectionRepository.deleteDualCardSection(id);

    sendSuccess(res, null, 'Dual card section deleted successfully');
    triggerRevalidation('dual-card-sections');
  },
);

export const toggleDualCardSectionStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Dual card section ID is required');
      return;
    }

    try {
      const updated = await dualCardSectionRepository.toggleDualCardSectionStatus(id);

      sendSuccess(
        res,
        updated,
        `Dual card section ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
      triggerRevalidation('dual-card-sections');
    } catch {
      sendNotFound(res, 'Dual card section not found');
    }
  },
);

export const reorderDualCardSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      sendBadRequest(res, 'Orders array is required');
      return;
    }

    await dualCardSectionRepository.reorderDualCardSections(orders);

    sendSuccess(res, null, 'Dual card sections reordered successfully');
    triggerRevalidation('dual-card-sections');
  },
);
