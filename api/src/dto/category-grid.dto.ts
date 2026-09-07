import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

export const categoryGridCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: emptyToUndefined(z.string().max(500).optional()),
  image: z.string().min(1, 'Image is required').max(1000),
  link: z.string().min(1, 'Link is required').max(500),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const categoryGridUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: emptyToUndefined(z.string().max(500).optional()),
  image: z.string().min(1).max(1000).optional(),
  link: z.string().min(1).max(500).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const categoryGridReorderSchema = z.object({
  orders: z.array(z.object({
    id: z.string().uuid(),
    order: z.number().int().min(0),
  })).min(1),
});

export type CategoryGridCreateDTO = z.infer<typeof categoryGridCreateSchema>;
export type CategoryGridUpdateDTO = z.infer<typeof categoryGridUpdateSchema>;
