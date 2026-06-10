import type { Request, RequestHandler, Response } from 'express';
import { editorialSectionRepository } from '../repositories/editorial-section.repository';
import { triggerRevalidation } from '../utils/webhook';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getEditorialSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const sectionFilters = {
      search: filters.search,
      isActive:
        filters.isActive === 'true'
          ? true
          : filters.isActive === 'false'
            ? false
            : undefined,
    };

    const result = await editorialSectionRepository.findEditorialSections(
      page,
      limit,
      sectionFilters,
      { sortBy, sortOrder },
    );

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getActiveEditorialSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sections = await editorialSectionRepository.findActiveEditorialSections();
    sendSuccess(res, sections);
  },
);

export const getEditorialSectionById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Editorial section ID is required');
      return;
    }

    const section = await editorialSectionRepository.findEditorialSectionById(id);

    if (!section) {
      sendNotFound(res, 'Editorial section not found');
      return;
    }

    sendSuccess(res, section);
  },
);

export const createEditorialSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { season, title, description, ctaText, ctaLink, images, featureType, productIds, isActive, order } = req.body;

    if (!season || !title) {
      sendBadRequest(res, 'Season and title are required');
      return;
    }

    const section = await editorialSectionRepository.createEditorialSection({
      season,
      title,
      description: description || undefined,
      ctaText: ctaText || undefined,
      ctaLink: ctaLink || undefined,
      images: images || [],
      featureType: featureType || undefined,
      productIds: productIds || [],
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : 0,
    });

    sendCreated(res, section, 'Editorial section created successfully');
    triggerRevalidation('editorial-sections');
  },
);

export const updateEditorialSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Editorial section ID is required');
      return;
    }

    const exists = await editorialSectionRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Editorial section not found');
      return;
    }

    const section = await editorialSectionRepository.updateEditorialSection(id, req.body);

    sendSuccess(res, section, 'Editorial section updated successfully');
    triggerRevalidation('editorial-sections');
  },
);

export const deleteEditorialSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Editorial section ID is required');
      return;
    }

    const exists = await editorialSectionRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Editorial section not found');
      return;
    }

    await editorialSectionRepository.deleteEditorialSection(id);

    sendSuccess(res, null, 'Editorial section deleted successfully');
    triggerRevalidation('editorial-sections');
  },
);

export const toggleEditorialSectionStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Editorial section ID is required');
      return;
    }

    try {
      const updated = await editorialSectionRepository.toggleEditorialSectionStatus(id);

      sendSuccess(
        res,
        updated,
        `Editorial section ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
      triggerRevalidation('editorial-sections');
    } catch {
      sendNotFound(res, 'Editorial section not found');
    }
  },
);

export const reorderEditorialSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      sendBadRequest(res, 'Orders array is required');
      return;
    }

    await editorialSectionRepository.reorderEditorialSections(orders);

    sendSuccess(res, null, 'Editorial sections reordered successfully');
    triggerRevalidation('editorial-sections');
  },
);
