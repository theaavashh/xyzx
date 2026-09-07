import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

const columnSchema = z.object({
  id: z.string().optional(),
  imageSrc: z.string().min(1, 'Image URL is required'),
  imageAlt: z.string().min(1, 'Alt text is required'),
  imageLink: emptyToUndefined(z.string().optional()),
  productName: emptyToUndefined(z.string().optional()),
  productPrice: z.number().optional(),
  productOriginalPrice: z.number().optional(),
  productImage: emptyToUndefined(z.string().optional()),
  productLink: emptyToUndefined(z.string().optional()),
  order: z.number().int().min(0).default(0),
});

export const threeImageGridCreateSchema = z.object({
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  columns: z.array(columnSchema).min(1, 'At least one column is required').default([]),
});

export const threeImageGridUpdateSchema = z.object({
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  columns: z.array(columnSchema).optional(),
});

export type ThreeImageGridCreateDTO = z.infer<typeof threeImageGridCreateSchema>;
export type ThreeImageGridUpdateDTO = z.infer<typeof threeImageGridUpdateSchema>;
