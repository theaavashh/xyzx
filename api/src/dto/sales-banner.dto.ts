import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

export const salesBannerCreateSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: emptyToUndefined(z.string().max(500).optional()),
  image: z.string().min(1, 'Image is required'),
  buttonText: emptyToUndefined(z.string().max(100).optional()),
  buttonUrl: emptyToUndefined(z.string().optional()),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const salesBannerUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: emptyToUndefined(z.string().max(500).optional()),
  image: emptyToUndefined(z.string().min(1).optional()),
  buttonText: emptyToUndefined(z.string().max(100).optional()),
  buttonUrl: emptyToUndefined(z.string().optional()),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export const salesBannerReorderSchema = z.object({
  orders: z.array(z.object({
    id: z.string().uuid(),
    order: z.number().int().min(0),
  })).min(1),
});

export type SalesBannerCreateDTO = z.infer<typeof salesBannerCreateSchema>;
export type SalesBannerUpdateDTO = z.infer<typeof salesBannerUpdateSchema>;
