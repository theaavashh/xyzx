import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

export const heroSlideCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: emptyToUndefined(z.string().max(500).optional()),
  image: z.string().min(1, 'Image is required').max(1000),
  imageMobile: emptyToUndefined(z.string().max(1000).optional()),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const heroSlideUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: emptyToUndefined(z.string().max(500).optional()),
  image: z.string().min(1).max(1000).optional(),
  imageMobile: emptyToUndefined(z.string().max(1000).optional()),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const heroSlideReorderSchema = z.object({
  orders: z.array(z.object({
    id: z.string().uuid(),
    order: z.number().int().min(0),
  })).min(1),
});

export type HeroSlideCreateDTO = z.infer<typeof heroSlideCreateSchema>;
export type HeroSlideUpdateDTO = z.infer<typeof heroSlideUpdateSchema>;
