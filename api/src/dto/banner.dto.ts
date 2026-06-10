import { z } from 'zod';

export const bannerCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  isActive: z.boolean().default(true),
  position: z.string().max(50).default('top'),
});

export const bannerUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
  position: z.string().max(50).optional(),
});

export const bannerReorderSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

export type BannerCreateDTO = z.infer<typeof bannerCreateSchema>;
export type BannerUpdateDTO = z.infer<typeof bannerUpdateSchema>;
export type BannerReorderDTO = z.infer<typeof bannerReorderSchema>;
