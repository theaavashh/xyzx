import type { Request, RequestHandler, Response } from 'express';
import { asyncHandler, parseQuery, sendBadRequest, sendConflict, sendCreated, sendNotFound, sendSuccess } from '../utils';
import { categoryService } from '../services/category.service';

export const getCategories: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters } = parseQuery(req);

    const categoryFilters = {
      isActive:
        filters.isActive === 'true'
          ? true
          : filters.isActive === 'false'
            ? false
            : undefined,
    };

    const result = await categoryService.getCategories(page, limit, categoryFilters);

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getCategoriesHierarchy: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await categoryService.getCategoriesHierarchy();
    sendSuccess(res, categories);
  },
);

export const getCategoryById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Category ID is required');
      return;
    }

    const category = await categoryService.getCategoryById(id);

    if (!category) {
      sendNotFound(res, 'Category not found');
      return;
    }

    sendSuccess(res, category);
  },
);

export const getCategoryBySlug: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug as string;

    if (!slug) {
      sendBadRequest(res, 'Category slug is required');
      return;
    }

    const category = await categoryService.getCategoryBySlug(slug);

    if (!category) {
      sendNotFound(res, 'Category not found');
      return;
    }

    sendSuccess(res, category);
  },
);

export const createCategory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, slug, image, internalLink, metaTitle, metaDescription, keywords } = req.body;

    const category = await categoryService.createCategory({
      name,
      slug,
      image,
      internalLink,
      metaTitle,
      metaDescription,
      keywords,
    });

    sendCreated(res, category, 'Category created successfully');
  },
);

export const updateCategory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Category ID is required');
      return;
    }

    const { name, slug, image, internalLink, isActive, metaTitle, metaDescription, keywords } = req.body;

    const category = await categoryService.updateCategory(id, {
      name,
      slug,
      image,
      internalLink,
      isActive,
      metaTitle,
      metaDescription,
      keywords,
    });

    sendSuccess(res, category, 'Category updated successfully');
  },
);

export const deleteCategory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Category ID is required');
      return;
    }

    await categoryService.deleteCategory(id);

    sendSuccess(res, null, 'Category deleted successfully');
  },
);

export const toggleCategoryStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Category ID is required');
      return;
    }

    const category = await categoryService.toggleCategoryStatus(id);

    sendSuccess(
      res,
      category,
      `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
    );
  },
);
