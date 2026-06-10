import type { Request, RequestHandler, Response } from 'express';
import { contactRepository } from '../repositories/contact.repository';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const submitContact: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;

    const submission = await contactRepository.create({
      name,
      email,
      subject,
      message,
    });

    sendCreated(res, submission, 'Contact message submitted successfully');
  },
);

export const getSubmissions: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const submissions = await contactRepository.findAll(true);
    sendSuccess(res, submissions);
  },
);

export const getSubmission: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Submission ID is required');
      return;
    }

    const submission = await contactRepository.findById(id);

    if (!submission) {
      sendNotFound(res, 'Contact submission not found');
      return;
    }

    sendSuccess(res, submission);
  },
);

export const deleteSubmission: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Submission ID is required');
      return;
    }

    const submission = await contactRepository.findById(id);

    if (!submission) {
      sendNotFound(res, 'Contact submission not found');
      return;
    }

    await contactRepository.deleteSubmission(id);
    sendSuccess(res, null, 'Contact submission deleted successfully');
  },
);

export const markAsRead: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Submission ID is required');
      return;
    }

    const submission = await contactRepository.findById(id);

    if (!submission) {
      sendNotFound(res, 'Contact submission not found');
      return;
    }

    const updated = await contactRepository.markAsRead(id);
    sendSuccess(res, updated, 'Contact submission marked as read');
  },
);
