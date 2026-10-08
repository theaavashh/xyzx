import type { Request, RequestHandler, Response } from 'express';
import { resolveFAQRepository } from '../di/index.js';
import { IFAQRepository } from '../interfaces/repositories/faq.repository.js';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

export const getAllFAQs: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const faqRepository = await resolveFAQRepository();
    const isAdmin = req.query.isAdmin === 'true';
    const faqs = await faqRepository.findAllFAQs(isAdmin);
    sendSuccess(res, faqs);
  },
);

export const getFAQById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const faqRepository = await resolveFAQRepository();
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
    const faqRepository = await resolveFAQRepository();
    const faqData = req.body;

    const faq = await faqRepository.createFAQ(faqData);
    sendCreated(res, faq, 'FAQ created successfully');
  },
);

export const updateFAQ: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const faqRepository = await resolveFAQRepository();
    const id = req.params.id as string;
    const faqData = req.body;

    if (!id) {
      sendBadRequest(res, 'FAQ ID is required');
      return;
    }

    const exists = await faqRepository.findFAQById(id);
    if (!exists) {
      sendNotFound(res, 'FAQ not found');
      return;
    }

    const faq = await faqRepository.updateFAQ(id, faqData);
    sendSuccess(res, faq, 'FAQ updated successfully');
  },
);

export const deleteFAQ: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const faqRepository = await resolveFAQRepository();
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
    const faqRepository = await resolveFAQRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'FAQ ID is required');
      return;
    }

    const faq = await faqRepository.toggleFAQStatus(id);
    sendSuccess(res, faq, `FAQ ${faq.isActive ? 'activated' : 'deactivated'} successfully`);
  },
);