import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

export const imageGridCreateSchema = z.object({
  src: z.string().min(1, 'Image URL is required').max(1000),
  alt: z.string().min(1, 'Alt text is required').max(500),
  title: emptyToUndefined(z.string().max(200).optional()),
  subtitle: emptyToUndefined(z.string().max(500).optional()),
  link: emptyToUndefined(z.string().max(500).optional()),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const imageGridUpdateSchema = z.object({
  src: z.string().min(1).max(1000).optional(),
  alt: z.string().min(1).max(500).optional(),
  title: emptyToUndefined(z.string().max(200).optional()),
  subtitle: emptyToUndefined(z.string().max(500).optional()),
  link: emptyToUndefined(z.string().max(500).optional()),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const imageGridReorderSchema = z.object({
  orders: z.array(z.object({
    id: z.string().uuid(),
    order: z.number().int().min(0),
  })).min(1),
});

export type ImageGridCreateDTO = z.infer<typeof imageGridCreateSchema>;
export type ImageGridUpdateDTO = z.infer<typeof imageGridUpdateSchema>;
