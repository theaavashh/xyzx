import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

const itemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: emptyToUndefined(z.string().optional()),
  image: z.string().min(1, 'Image URL is required'),
  link: z.string().min(1, 'Link is required'),
  order: z.number().int().min(0).default(0),
});

export const categoryTileGridCreateSchema = z.object({
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  items: z.array(itemSchema).min(1, 'At least one tile is required').default([]),
});

export const categoryTileGridUpdateSchema = z.object({
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  items: z.array(itemSchema).optional(),
});

export type CategoryTileGridCreateDTO = z.infer<typeof categoryTileGridCreateSchema>;
export type CategoryTileGridUpdateDTO = z.infer<typeof categoryTileGridUpdateSchema>;
