import type { Request, RequestHandler, Response } from 'express';
import { faqRepository } from '../repositories/faq.repository';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const getFAQs: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const faqs = await faqRepository.findAllFAQs(false);
    sendSuccess(res, faqs);
  },
);

export const getAllFAQs: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const faqs = await faqRepository.findAllFAQs(true);
    sendSuccess(res, faqs);
  },
);

export const getFAQById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'FAQ ID is required');
      return;
    }

    const faq = await faqRepository.findFAQById(id);

    if (!faq) {
      sendNotFound(res, 'FAQ not found');
      return;
    }

    sendSuccess(res, faq);
  },
);

export const createFAQ: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { question, answer, category, order, isActive } = req.body;

    const newFAQ = await faqRepository.createFAQ({
      question,
      answer,
      category,
      order: order ?? 0,
      isActive: isActive ?? true,
    });

    sendCreated(res, newFAQ, 'FAQ created successfully');
  },
);

export const updateFAQ: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'FAQ ID is required');
      return;
    }

    const exists = await faqRepository.findFAQById(id);
    if (!exists) {
      sendNotFound(res, 'FAQ not found');
      return;
    }

    const { question, answer, category, order, isActive } = req.body;

    const updateData: Record<string, unknown> = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (category !== undefined) updateData.category = category;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await faqRepository.updateFAQ(id, updateData);

    sendSuccess(res, updated, 'FAQ updated successfully');
  },
);

export const deleteFAQ: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'FAQ ID is required');
      return;
    }

    const exists = await faqRepository.findFAQById(id);
    if (!exists) {
      sendNotFound(res, 'FAQ not found');
      return;
    }

    await faqRepository.deleteFAQ(id);

    sendSuccess(res, null, 'FAQ deleted successfully');
  },
);

export const toggleFAQStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'FAQ ID is required');
      return;
    }

    try {
      const updated = await faqRepository.toggleFAQStatus(id);

      sendSuccess(
        res,
        updated,
        `FAQ ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'FAQ not found');
    }
  },
);
