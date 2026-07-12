import { z } from 'zod';

export const bannerCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  isActive: z.boolean().default(true),
  position: z.string().max(50).default('top'),
  endDate: z.string().datetime().optional().nullable(),
  buttonText: z.string().max(100).optional().nullable(),
  buttonUrl: z.string().max(500).optional().nullable(),
  backgroundColor: z.string().max(50).optional().nullable(),
  textColor: z.string().max(50).optional().nullable(),
});

export const bannerUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
  position: z.string().max(50).optional(),
  endDate: z.string().datetime().optional().nullable(),
  buttonText: z.string().max(100).optional().nullable(),
  buttonUrl: z.string().max(500).optional().nullable(),
  backgroundColor: z.string().max(50).optional().nullable(),
  textColor: z.string().max(50).optional().nullable(),
});

export const bannerReorderSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

export type BannerCreateDTO = z.infer<typeof bannerCreateSchema>;
export type BannerUpdateDTO = z.infer<typeof bannerUpdateSchema>;
export type BannerReorderDTO = z.infer<typeof bannerReorderSchema>;
