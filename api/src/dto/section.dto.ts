import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

export const sectionCreateSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: emptyToUndefined(z.string().max(500).optional()),
  largeImage: emptyToUndefined(z.string().max(1000).optional()),
  smallImage: emptyToUndefined(z.string().max(1000).optional()),
  videoUrl: emptyToUndefined(z.string().max(1000).optional()),
  buttonUrl: emptyToUndefined(z.string().optional()),
  buttonText: emptyToUndefined(z.string().max(100).optional()),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const sectionUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: emptyToUndefined(z.string().max(500).optional()),
  largeImage: emptyToUndefined(z.string().max(1000).optional()),
  smallImage: emptyToUndefined(z.string().max(1000).optional()),
  videoUrl: emptyToUndefined(z.string().max(1000).optional()),
  buttonUrl: emptyToUndefined(z.string().optional()),
  buttonText: emptyToUndefined(z.string().max(100).optional()),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export const sectionReorderSchema = z.object({
  orders: z.array(z.object({
    id: z.string().uuid(),
    order: z.number().int().min(0),
  })).min(1),
});

export const toggleStatusSchema = z.object({
  isActive: z.boolean(),
});

export type SectionCreateDTO = z.infer<typeof sectionCreateSchema>;
export type SectionUpdateDTO = z.infer<typeof sectionUpdateSchema>;
