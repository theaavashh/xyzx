import { z } from 'zod';

export const promotionalBannerCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: z.string().max(500).optional(),
  image: z.string().min(1, 'Image is required'),
  textColor: z.string().default('#ffffff'),
  link: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const promotionalBannerUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(500).optional(),
  image: z.string().min(1).optional(),
  textColor: z.string().optional(),
  link: z.string().url().optional().or(z.literal('')).optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export type PromotionalBannerCreateDTO = z.infer<typeof promotionalBannerCreateSchema>;
export type PromotionalBannerUpdateDTO = z.infer<typeof promotionalBannerUpdateSchema>;
