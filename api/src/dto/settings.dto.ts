import { z } from 'zod';

export const settingsUpdateSchema = z.object({}).passthrough();

export const seoUpdateSchema = z.object({
  page: z.string().min(1).max(100),
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  keywords: z.array(z.string()).optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().max(500).optional(),
  ogImage: z.string().url().optional(),
  canonicalUrl: z.string().url().optional(),
});

export const uploadSchema = z.object({
  type: z.enum(['image', 'document', 'video']).optional(),
  folder: z.string().max(100).optional(),
});

export const rewardSettingsSchema = z.object({
  amountUnit: z.number().positive().default(100),
  rewardValue: z.number().positive().default(1),
  isActive: z.boolean().default(true),
  maxRedemptionPerOrder: z.number().int().positive().optional(),
});

export const rewardCreateSchema = z.object({
  userId: z.string().uuid(),
  points: z.number().int().positive(),
  description: z.string().min(1).max(500),
});

export const colorThemeSchema = z.object({
  primaryColor: z.string().min(1).max(7),
  secondaryColor: z.string().min(1).max(7).optional(),
  accentColor: z.string().min(1).max(7).optional(),
  backgroundColor: z.string().min(1).max(7).optional(),
  textColor: z.string().min(1).max(7).optional(),
});

export const jsonLdSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().min(1).max(100),
  page: z.string().min(1).max(100),
  schema: z.any(),
  variables: z.any().optional(),
  isActive: z.boolean().optional(),
  priority: z.number().int().min(0).optional(),
});

export type SettingsUpdateDTO = z.infer<typeof settingsUpdateSchema>;
export type SeoUpdateDTO = z.infer<typeof seoUpdateSchema>;
export type UploadDTO = z.infer<typeof uploadSchema>;
export type RewardSettingsDTO = z.infer<typeof rewardSettingsSchema>;
export type RewardCreateDTO = z.infer<typeof rewardCreateSchema>;
export type ColorThemeDTO = z.infer<typeof colorThemeSchema>;
export type JsonLdDTO = z.infer<typeof jsonLdSchema>;
