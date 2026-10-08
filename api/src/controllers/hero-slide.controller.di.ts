import type { Request, RequestHandler, Response } from 'express';
import { resolveHeroSlideRepository } from '../di/index.js';
import { IHeroSlideRepository } from '../interfaces/repositories/hero-slide.repository.js';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

export const getActiveHeroSlides: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const heroSlideRepository = await resolveHeroSlideRepository();
    const slides = await heroSlideRepository.findActiveHeroSlides();
    sendSuccess(res, slides);
  },
);

export const getAllHeroSlides: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const heroSlideRepository = await resolveHeroSlideRepository();
    const slides = await heroSlideRepository.findAllHeroSlides();
    sendSuccess(res, slides);
  },
);

export const getHeroSlideById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const heroSlideRepository = await resolveHeroSlideRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Hero slide ID is required');
      return;
    }

    const slide = await heroSlideRepository.findHeroSlideById(id);

    if (!slide) {
      sendNotFound(res, 'Hero slide not found');
      return;
    }

    sendSuccess(res, slide);
  },
);

export const createHeroSlide: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const heroSlideRepository = await resolveHeroSlideRepository();
    const slideData = req.body;

    const slide = await heroSlideRepository.createHeroSlide(slideData);
    sendCreated(res, slide, 'Hero slide created successfully');
  },
);

export const updateHeroSlide: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const heroSlideRepository = await resolveHeroSlideRepository();
    const id = req.params.id as string;
    const slideData = req.body;

    if (!id) {
      sendBadRequest(res, 'Hero slide ID is required');
      return;
    }

    const exists = await heroSlideRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Hero slide not found');
      return;
    }

    const slide = await heroSlideRepository.updateHeroSlide(id, slideData);
    sendSuccess(res, slide, 'Hero slide updated successfully');
  },
);

export const deleteHeroSlide: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const heroSlideRepository = await resolveHeroSlideRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Hero slide ID is required');
      return;
    }

    const exists = await heroSlideRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Hero slide not found');
      return;
    }

    await heroSlideRepository.deleteHeroSlide(id);
    sendSuccess(res, null, 'Hero slide deleted successfully');
  },
);

export const toggleHeroSlideStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const heroSlideRepository = await resolveHeroSlideRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Hero slide ID is required');
      return;
    }

    const slide = await heroSlideRepository.toggleHeroSlideStatus(id);
    sendSuccess(res, slide, `Hero slide ${slide.isActive ? 'activated' : 'deactivated'} successfully`);
  },
);

export const reorderHeroSlides: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const heroSlideRepository = await resolveHeroSlideRepository();
    const orders = req.body as Array<{ id: string; order: number }>;

    if (!Array.isArray(orders) || orders.length === 0) {
      sendBadRequest(res, 'Orders array is required');
      return;
    }

    await heroSlideRepository.reorderHeroSlides(orders);
    sendSuccess(res, null, 'Hero slides reordered successfully');
  },
);