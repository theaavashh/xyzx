import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendCreated,
  sendNotFound,
  sendSuccess,
  sendError,
} from '../utils';
import { logger } from '../utils/logger';

export const getActiveAboutSection: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const section = await prisma.aboutSection.findFirst({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    sendSuccess(res, section);
  },
);

export const getAllAboutSections: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sections = await prisma.aboutSection.findMany({
      orderBy: { order: 'asc' },
    });
    sendSuccess(res, sections);
  },
);

export const getAboutSectionById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const section = await prisma.aboutSection.findUnique({ where: { id } });

    if (!section) {
      sendNotFound(res, 'About section not found');
      return;
    }

    sendSuccess(res, section);
  },
);

const handleDbError = (res: Response, action: string) => (error: unknown) => {
  logger.error(`About section ${action} failed`, undefined, error as Error);
  const detail = error instanceof Error ? error.message : 'Unknown error';
  return sendError(
    res,
    `Failed to ${action} about section. ${detail}`,
    500,
  );
};

export const createAboutSection: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      quote, ctaText, ctaUrl,
      heroImage, heroSubtitle, heroTagline,
      storyTitle, storyContent, storyImage,
      pullQuote,
      videoUrl, videoOverlayText,
      bannerImage, bannerText,
      storeDescription, storeAddress, storeCity, storeState, storeZip, storePhone, storeEmail,
      metaTitle, metaDescription,
      isActive, order,
    } = req.body;

    const section = await prisma.aboutSection.create({
      data: {
        quote,
        ctaText: ctaText ?? 'More About Us',
        ctaUrl: ctaUrl ?? '/about',
        heroImage: heroImage ?? null,
        heroSubtitle: heroSubtitle ?? null,
        heroTagline: heroTagline ?? null,
        storyTitle: storyTitle ?? null,
        storyContent: storyContent ?? null,
        storyImage: storyImage ?? null,
        pullQuote: pullQuote ?? null,
        videoUrl: videoUrl ?? null,
        videoOverlayText: videoOverlayText ?? null,
        bannerImage: bannerImage ?? null,
        bannerText: bannerText ?? null,
        storeDescription: storeDescription ?? null,
        storeAddress: storeAddress ?? null,
        storeCity: storeCity ?? null,
        storeState: storeState ?? null,
        storeZip: storeZip ?? null,
        storePhone: storePhone ?? null,
        storeEmail: storeEmail ?? null,
        metaTitle: metaTitle ?? null,
        metaDescription: metaDescription ?? null,
        isActive: isActive ?? true,
        order: order ?? 0,
      },
    });

    sendCreated(res, section, 'About section created successfully');
  } catch (error) {
    return handleDbError(res, 'create')(error);
  }
};

export const updateAboutSection: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.params.id as string;
    const {
      quote, ctaText, ctaUrl,
      heroImage, heroSubtitle, heroTagline,
      storyTitle, storyContent, storyImage,
      pullQuote,
      videoUrl, videoOverlayText,
      bannerImage, bannerText,
      storeDescription, storeAddress, storeCity, storeState, storeZip, storePhone, storeEmail,
      metaTitle, metaDescription,
      isActive, order,
    } = req.body;

    const existing = await prisma.aboutSection.findUnique({ where: { id } });

    if (!existing) {
      sendNotFound(res, 'About section not found');
      return;
    }

    const section = await prisma.aboutSection.update({
      where: { id },
      data: {
        ...(quote !== undefined && { quote }),
        ...(ctaText !== undefined && { ctaText }),
        ...(ctaUrl !== undefined && { ctaUrl }),
        ...(heroImage !== undefined && { heroImage: heroImage ?? null }),
        ...(heroSubtitle !== undefined && { heroSubtitle: heroSubtitle ?? null }),
        ...(heroTagline !== undefined && { heroTagline: heroTagline ?? null }),
        ...(storyTitle !== undefined && { storyTitle: storyTitle ?? null }),
        ...(storyContent !== undefined && { storyContent: storyContent ?? null }),
        ...(storyImage !== undefined && { storyImage: storyImage ?? null }),
        ...(pullQuote !== undefined && { pullQuote: pullQuote ?? null }),
        ...(videoUrl !== undefined && { videoUrl: videoUrl ?? null }),
        ...(videoOverlayText !== undefined && { videoOverlayText: videoOverlayText ?? null }),
        ...(bannerImage !== undefined && { bannerImage: bannerImage ?? null }),
        ...(bannerText !== undefined && { bannerText: bannerText ?? null }),
        ...(storeDescription !== undefined && { storeDescription: storeDescription ?? null }),
        ...(storeAddress !== undefined && { storeAddress: storeAddress ?? null }),
        ...(storeCity !== undefined && { storeCity: storeCity ?? null }),
        ...(storeState !== undefined && { storeState: storeState ?? null }),
        ...(storeZip !== undefined && { storeZip: storeZip ?? null }),
        ...(storePhone !== undefined && { storePhone: storePhone ?? null }),
        ...(storeEmail !== undefined && { storeEmail: storeEmail ?? null }),
        ...(metaTitle !== undefined && { metaTitle: metaTitle ?? null }),
        ...(metaDescription !== undefined && { metaDescription: metaDescription ?? null }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    });

    sendSuccess(res, section, 'About section updated successfully');
  } catch (error) {
    return handleDbError(res, 'update')(error);
  }
};

export const deleteAboutSection: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.aboutSection.findUnique({ where: { id } });

    if (!existing) {
      sendNotFound(res, 'About section not found');
      return;
    }

    await prisma.aboutSection.delete({ where: { id } });

    sendSuccess(res, null, 'About section deleted successfully');
  } catch (error) {
    return handleDbError(res, 'delete')(error);
  }
};

export const toggleAboutSectionStatus: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = req.params.id as string;

    const section = await prisma.aboutSection.findUnique({ where: { id } });

    if (!section) {
      sendNotFound(res, 'About section not found');
      return;
    }

    const updated = await prisma.aboutSection.update({
      where: { id },
      data: { isActive: !section.isActive },
    });

    sendSuccess(
      res,
      updated,
      `About section ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
    );
  } catch (error) {
    return handleDbError(res, 'update')(error);
  }
};
