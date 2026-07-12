import type { Request, RequestHandler, Response } from 'express';
import { featuredSectionRepository } from '../repositories/featured-section.repository';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getFeaturedSections: RequestHandler = asyncHandler(
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

    const result = await featuredSectionRepository.findFeaturedSections(
      page,
      limit,
      sectionFilters,
      { sortBy, sortOrder },
    );

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getActiveFeaturedSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sections = await featuredSectionRepository.findActiveFeaturedSections();
    sendSuccess(res, sections);
  },
);

export const getFeaturedSectionById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Featured section ID is required');
      return;
    }

    const section = await featuredSectionRepository.findFeaturedSectionById(id);

    if (!section) {
      sendNotFound(res, 'Featured section not found');
      return;
    }

    sendSuccess(res, section);
  },
);

export const createFeaturedSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      subtitle,
      description,
      image,
      ctaUrl,
      ctaText,
      isActive,
      order,
    } = req.body;

    const section = await featuredSectionRepository.createFeaturedSection({
      title,
      subtitle: subtitle || undefined,
      description: description || undefined,
      image: image || undefined,
      ctaUrl: ctaUrl || undefined,
      ctaText: ctaText || undefined,
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : 0,
    });

    sendCreated(res, section, 'Featured section created successfully');
  },
);

export const updateFeaturedSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Featured section ID is required');
      return;
    }

    const exists = await featuredSectionRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Featured section not found');
      return;
    }

    const { title, subtitle, description, image, ctaUrl, ctaText, isActive, order } = req.body;
    const section = await featuredSectionRepository.updateFeaturedSection(id, {
      title,
      subtitle: subtitle || undefined,
      description: description || undefined,
      image: image || undefined,
      ctaUrl: ctaUrl || undefined,
      ctaText: ctaText || undefined,
      isActive: isActive !== undefined ? isActive : undefined,
      order: order !== undefined ? order : undefined,
    });

    sendSuccess(res, section, 'Featured section updated successfully');
  },
);

export const deleteFeaturedSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Featured section ID is required');
      return;
    }

    const exists = await featuredSectionRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Featured section not found');
      return;
    }

    await featuredSectionRepository.deleteFeaturedSection(id);

    sendSuccess(res, null, 'Featured section deleted successfully');
  },
);

export const toggleFeaturedSectionStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Featured section ID is required');
      return;
    }

    try {
      const updated = await featuredSectionRepository.toggleFeaturedSectionStatus(id);

      sendSuccess(
        res,
        updated,
        `Featured section ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Featured section not found');
    }
  },
);

export const reorderFeaturedSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      sendBadRequest(res, 'Orders array is required');
      return;
    }

    await featuredSectionRepository.reorderFeaturedSections(orders);

    sendSuccess(res, null, 'Featured sections reordered successfully');
  },
);
