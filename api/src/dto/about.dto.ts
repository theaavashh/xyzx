import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

export const aboutSectionCreateSchema = z.object({
  quote: z.string().min(1).max(1000),
  ctaText: emptyToUndefined(z.string().max(200).optional()),
  ctaUrl: emptyToUndefined(z.string().max(500).optional()),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const aboutSectionUpdateSchema = z.object({
  quote: emptyToUndefined(z.string().min(1).max(1000).optional()),
  ctaText: emptyToUndefined(z.string().max(200).optional()),
  ctaUrl: emptyToUndefined(z.string().max(500).optional()),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export type AboutSectionCreateDTO = z.infer<typeof aboutSectionCreateSchema>;
export type AboutSectionUpdateDTO = z.infer<typeof aboutSectionUpdateSchema>;
