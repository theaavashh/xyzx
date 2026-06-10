import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import { asyncHandler, sendSuccess, sendError } from '../utils';

const allowedSettingsFields = [
  'siteName', 'siteDescription', 'siteUrl', 'siteLogo', 'siteFavicon',
  'email', 'phone', 'address', 'city', 'country',
  'currency', 'timezone', 'language',
  'paymentMethods', 'taxRate', 'shippingCost',
  'emailNotifications', 'smsNotifications', 'pushNotifications',
  'twoFactorAuth', 'sessionTimeout', 'passwordPolicy',
  'lowStockThreshold', 'autoReorder', 'trackInventory',
  'seoTitle', 'seoDescription', 'seoKeywords',
  'ogTitle', 'ogDescription', 'ogImage', 'ogType',
  'twitterCard', 'twitterSite',
  'googleAnalyticsId', 'facebookPixelId', 'conversionTracking',
  'primaryColor', 'secondaryColor', 'accentColor',
  'backgroundColor', 'textColor',
  'buttonPrimaryBg', 'buttonPrimaryText',
  'buttonSecondaryBg', 'buttonSecondaryText',
  'bannerBackgroundColor', 'bannerTextColor',
  'cardBackgroundColor', 'cardBorderColor',
  'headerBackgroundColor', 'footerBackgroundColor',
  'theme',
  'defaultVariantImageWidth', 'defaultVariantImageHeight',
  'variantAutoGeneration', 'allowVariantCombinations',
  'showOutOfStockVariants', 'variantFallbackEnabled',
  'variantAttributeTypes',
  'googleAnalyticsMeasurementId', 'googleAnalyticsTrackingId',
  'enhancedEcommerceEnabled', 'googleAdsEnabled',
  'googleAdsConversionId', 'googleAdsConversionLabel',
  'facebookConversionApiEnabled', 'facebookConversionApiToken',
  'facebookPixelAdvancedMatching', 'customTrackingScripts',
  'stripePublishableKey', 'stripeSecretKey', 'stripeWebhookSecret',
  'bankApiKey', 'australiaPostApiKey',
];

function filterSettingsBody(body: Record<string, unknown>): Record<string, unknown> {
  const filtered: Record<string, unknown> = {};
  for (const key of allowedSettingsFields) {
    if (key in body) {
      filtered[key] = body[key];
    }
  }
  return filtered;
}

export const getSettings: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!settings) {
      const defaultSettings = await prisma.siteSettings.create({
        data: {},
      });
      return sendSuccess(res, defaultSettings);
    }

    sendSuccess(res, settings);
  },
);

export const updateSettings: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const filteredData = filterSettingsBody(req.body);

    const existingSettings = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!existingSettings) {
      const newSettings = await prisma.siteSettings.create({
        data: filteredData,
      });
      return sendSuccess(res, newSettings);
    }

    const updatedSettings = await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: filteredData,
    });

    sendSuccess(res, updatedSettings);
  },
);

export const resetSettings: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    await prisma.siteSettings.deleteMany({});
    const defaultSettings = await prisma.siteSettings.create({
      data: {},
    });
    sendSuccess(res, defaultSettings);
  },
);
