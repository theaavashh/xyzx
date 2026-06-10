import type { Request, RequestHandler, Response } from 'express';
import { contentRepository } from '../repositories/content.repository';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getContentPages: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const contentFilters = {
      search: filters.search,
      isActive:
        filters.isActive === 'true'
          ? true
          : filters.isActive === 'false'
            ? false
            : undefined,
    };

    const result = await contentRepository.findContentPages(page, limit, contentFilters, {
      sortBy,
      sortOrder,
    });

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getContentPageBySlug: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug as string;

    if (!slug) {
      sendBadRequest(res, 'Content page slug is required');
      return;
    }

    const content = await contentRepository.findContentBySlug(slug);

    if (!content) {
      sendNotFound(res, 'Content page not found');
      return;
    }

    sendSuccess(res, content);
  },
);

export const getContentPageById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Content page ID is required');
      return;
    }

    const content = await contentRepository.findContentById(id);

    if (!content) {
      sendNotFound(res, 'Content page not found');
      return;
    }

    sendSuccess(res, content);
  },
);

export const createContentPage: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug, title, content, metaTitle, metaDescription } = req.body;

    const slugExists = await contentRepository.existsBySlug(slug);
    if (slugExists) {
      sendConflict(res, 'Content page with this slug already exists');
      return;
    }

    const newContent = await contentRepository.createContent({
      slug,
      title,
      content,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      isActive: true,
    });

    sendCreated(res, newContent, 'Content page created successfully');
  },
);

export const updateContentPage: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, content, metaTitle, metaDescription, isActive } = req.body;

    if (!id) {
      sendBadRequest(res, 'Content page ID is required');
      return;
    }

    const exists = await contentRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Content page not found');
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await contentRepository.updateContent(id, updateData);

    sendSuccess(res, updated, 'Content page updated successfully');
  },
);

export const updateContentPageBySlug: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const { title, content, metaTitle, metaDescription, isActive } = req.body;

    if (!slug) {
      sendBadRequest(res, 'Content page slug is required');
      return;
    }

    const exists = await contentRepository.existsBySlug(slug);
    if (!exists) {
      sendNotFound(res, 'Content page not found');
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await contentRepository.updateContentBySlug(slug, updateData);

    sendSuccess(res, updated, 'Content page updated successfully');
  },
);

export const deleteContentPage: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Content page ID is required');
      return;
    }

    const exists = await contentRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Content page not found');
      return;
    }

    await contentRepository.deleteContent(id);

    sendSuccess(res, null, 'Content page deleted successfully');
  },
);

export const deleteContentPageBySlug: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug as string;

    if (!slug) {
      sendBadRequest(res, 'Content page slug is required');
      return;
    }

    const exists = await contentRepository.existsBySlug(slug);
    if (!exists) {
      sendNotFound(res, 'Content page not found');
      return;
    }

    await contentRepository.deleteContentBySlug(slug);

    sendSuccess(res, null, 'Content page deleted successfully');
  },
);

export const upsertContentBySlug: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const { title, content, metaTitle, metaDescription } = req.body;

    if (!slug) {
      sendBadRequest(res, 'Content page slug is required');
      return;
    }

    const exists = await contentRepository.existsBySlug(slug);

    if (exists) {
      const updateData: Record<string, unknown> = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
      if (metaDescription !== undefined) updateData.metaDescription = metaDescription;

      const updated = await contentRepository.updateContentBySlug(slug, updateData);
      sendSuccess(res, updated, 'Content page updated successfully');
    } else {
      const newContent = await contentRepository.createContent({
        slug,
        title: title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        content: content || '',
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        isActive: true,
      });
      sendCreated(res, newContent, 'Content page created successfully');
    }
  },
);

export const toggleContentPageStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Content page ID is required');
      return;
    }

    try {
      const updated = await contentRepository.toggleContentStatus(id);

      sendSuccess(
        res,
        updated,
        `Content page ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Content page not found');
    }
  },
);

export const toggleContentPageStatusBySlug: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug as string;

    if (!slug) {
      sendBadRequest(res, 'Content page slug is required');
      return;
    }

    const content = await contentRepository.findContentBySlug(slug);
    if (!content) {
      sendNotFound(res, 'Content page not found');
      return;
    }

    const updated = await contentRepository.toggleContentStatus(content.id);

    sendSuccess(
      res,
      updated,
      `Content page ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
    );
  },
);
