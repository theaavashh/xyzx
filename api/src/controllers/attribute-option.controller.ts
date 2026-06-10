import type { Request, RequestHandler, Response } from 'express';
import { asyncHandler, sendBadRequest, sendCreated, sendNotFound, sendSuccess } from '../utils';
import { attributeOptionRepository } from '../repositories/attribute-option.repository';

export const getAttributeOptions: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const filters: { type?: string; isActive?: boolean } = {};

    if (req.query.type) {
      filters.type = String(req.query.type);
    }
    if (req.query.isActive === 'true') {
      filters.isActive = true;
    } else if (req.query.isActive === 'false') {
      filters.isActive = false;
    }

    const options = await attributeOptionRepository.findAll(filters);
    sendSuccess(res, options);
  },
);

export const createAttributeOption: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    const option = await attributeOptionRepository.create({
      type: data.type,
      value: data.value,
      label: data.label,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    });
    sendCreated(res, option, 'Attribute option created successfully');
  },
);

export const deleteAttributeOption: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Attribute option ID is required');
      return;
    }

    const exists = await attributeOptionRepository.findById(id);
    if (!exists) {
      sendNotFound(res, 'Attribute option not found');
      return;
    }

    await attributeOptionRepository.remove(id);
    sendSuccess(res, null, 'Attribute option deleted successfully');
  },
);
