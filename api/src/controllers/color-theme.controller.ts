import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import { asyncHandler, sendSuccess } from '../utils';

export const getColorSettings: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    let settings = await prisma.colorSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!settings) {
      settings = await prisma.colorSettings.create({
        data: {
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          accentColor: '#F59E0B',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          buttonPrimaryBg: '#3B82F6',
          buttonPrimaryText: '#FFFFFF',
          buttonSecondaryBg: '#F3F4F6',
          buttonSecondaryText: '#1F2937',
          bannerBackgroundColor: '#F9FAFB',
          bannerTextColor: '#1F2937',
          cardBackgroundColor: '#FFFFFF',
          cardBorderColor: '#E5E7EB',
          headerBackgroundColor: '#FFFFFF',
          footerBackgroundColor: '#1F2937',
        },
      });
    }

    sendSuccess(res, settings);
  },
);

export const updateColorSettings: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      primaryColor, secondaryColor, accentColor, backgroundColor, textColor,
      buttonPrimaryBg, buttonPrimaryText, buttonSecondaryBg, buttonSecondaryText,
      bannerBackgroundColor, bannerTextColor, cardBackgroundColor, cardBorderColor,
      headerBackgroundColor, footerBackgroundColor,
    } = req.body;

    let settings = await prisma.colorSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (settings) {
      settings = await prisma.colorSettings.update({
        where: { id: settings.id },
        data: {
          ...(primaryColor !== undefined && { primaryColor }),
          ...(secondaryColor !== undefined && { secondaryColor }),
          ...(accentColor !== undefined && { accentColor }),
          ...(backgroundColor !== undefined && { backgroundColor }),
          ...(textColor !== undefined && { textColor }),
          ...(buttonPrimaryBg !== undefined && { buttonPrimaryBg }),
          ...(buttonPrimaryText !== undefined && { buttonPrimaryText }),
          ...(buttonSecondaryBg !== undefined && { buttonSecondaryBg }),
          ...(buttonSecondaryText !== undefined && { buttonSecondaryText }),
          ...(bannerBackgroundColor !== undefined && { bannerBackgroundColor }),
          ...(bannerTextColor !== undefined && { bannerTextColor }),
          ...(cardBackgroundColor !== undefined && { cardBackgroundColor }),
          ...(cardBorderColor !== undefined && { cardBorderColor }),
          ...(headerBackgroundColor !== undefined && { headerBackgroundColor }),
          ...(footerBackgroundColor !== undefined && { footerBackgroundColor }),
        },
      });
    } else {
      settings = await prisma.colorSettings.create({
        data: {
          primaryColor: primaryColor ?? '#3B82F6',
          secondaryColor: secondaryColor ?? '#10B981',
          accentColor: accentColor ?? '#F59E0B',
          backgroundColor: backgroundColor ?? '#FFFFFF',
          textColor: textColor ?? '#1F2937',
          buttonPrimaryBg: buttonPrimaryBg ?? '#3B82F6',
          buttonPrimaryText: buttonPrimaryText ?? '#FFFFFF',
          buttonSecondaryBg: buttonSecondaryBg ?? '#F3F4F6',
          buttonSecondaryText: buttonSecondaryText ?? '#1F2937',
          bannerBackgroundColor: bannerBackgroundColor ?? '#F9FAFB',
          bannerTextColor: bannerTextColor ?? '#1F2937',
          cardBackgroundColor: cardBackgroundColor ?? '#FFFFFF',
          cardBorderColor: cardBorderColor ?? '#E5E7EB',
          headerBackgroundColor: headerBackgroundColor ?? '#FFFFFF',
          footerBackgroundColor: footerBackgroundColor ?? '#1F2937',
        },
      });
    }

    sendSuccess(res, settings, 'Color settings updated successfully');
  },
);
