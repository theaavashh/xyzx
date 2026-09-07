import { z } from 'zod';

export const featureConfigCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  icon: z.string().max(100).optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const featureConfigUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().max(100).optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export type FeatureConfigCreateDTO = z.infer<typeof featureConfigCreateSchema>;
export type FeatureConfigUpdateDTO = z.infer<typeof featureConfigUpdateSchema>;
