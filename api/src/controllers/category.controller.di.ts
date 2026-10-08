import type { Request, RequestHandler, Response } from 'express';
import { resolveCategoryRepository } from '../di/index.js';
import { ICategoryRepository } from '../interfaces/repositories/category.repository.js';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

export const getCategories: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryRepository = await resolveCategoryRepository();
    const { page, limit, filters } = parseQuery(req);

    const categoryFilters = {
      isActive: filters.isActive ? filters.isActive === 'true' : undefined,
    };

    const result = await categoryRepository.findCategories(page, limit, categoryFilters);

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getCategoriesWithHierarchy: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryRepository = await resolveCategoryRepository();
    const categories = await categoryRepository.findCategoriesWithHierarchy();
    sendSuccess(res, categories);
  },
);

export const getCategoryById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryRepository = await resolveCategoryRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Category ID is required');
      return;
    }

    const category = await categoryRepository.findCategoryById(id);

    if (!category) {
      sendNotFound(res, 'Category not found');
      return;
    }

    sendSuccess(res, category);
  },
);

export const getCategoryBySlug: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryRepository = await resolveCategoryRepository();
    const slug = req.params.slug as string;

    if (!slug) {
      sendBadRequest(res, 'Category slug is required');
      return;
    }

    const category = await categoryRepository.findCategoryBySlug(slug);

    if (!category) {
      sendNotFound(res, 'Category not found');
      return;
    }

    sendSuccess(res, category);
  },
);

export const createCategory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryRepository = await resolveCategoryRepository();
    const categoryData = req.body;

    if (categoryData.slug) {
      const slugExists = await categoryRepository.existsBySlug(categoryData.slug);
      if (slugExists) {
        sendConflict(res, 'Category with this slug already exists');
        return;
      }
    } else {
      const baseSlug =
        (categoryData.name || 'category')
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/^-+|-+$/g, '') || 'category';
      let slug = baseSlug;
      let suffix = 2;
      while (await categoryRepository.existsBySlug(slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }
      categoryData.slug = slug;
    }

    const category = await categoryRepository.createCategory(categoryData);

    sendCreated(res, category, 'Category created successfully');
  },
);

export const updateCategory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryRepository = await resolveCategoryRepository();
    const id = req.params.id as string;
    const categoryData = req.body;

    if (!id) {
      sendBadRequest(res, 'Category ID is required');
      return;
    }

    const exists = await categoryRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Category not found');
      return;
    }

    if (categoryData.slug) {
      const existingCategory = await categoryRepository.findCategoryById(id);
      if (existingCategory && categoryData.slug !== existingCategory.slug) {
        const slugExists = await categoryRepository.existsBySlug(categoryData.slug);
        if (slugExists) {
          sendConflict(res, 'Category with this slug already exists');
          return;
        }
      }
    }

    const category = await categoryRepository.updateCategory(id, categoryData);

    sendSuccess(res, category, 'Category updated successfully');
  },
);

export const deleteCategory: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryRepository = await resolveCategoryRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Category ID is required');
      return;
    }

    const exists = await categoryRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Category not found');
      return;
    }

    const hasChildren = await categoryRepository.hasChildren(id);
    if (hasChildren) {
      sendBadRequest(res, 'Cannot delete category with children');
      return;
    }

    const hasProducts = await categoryRepository.hasProducts(id);
    if (hasProducts) {
      sendBadRequest(res, 'Cannot delete category with products');
      return;
    }

    await categoryRepository.deleteCategory(id);

    sendSuccess(res, null, 'Category deleted successfully');
  },
);