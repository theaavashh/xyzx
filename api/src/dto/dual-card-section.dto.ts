import { z } from 'zod';

const dualCardSchema = z.object({
  id: z.string().optional(),
  src: z.string(),
  alt: z.string().optional().default(''),
  label: z.string(),
  link: z.string().optional().default('/'),
  buttonText: z.string().optional(),
});

export const dualCardSectionCreateSchema = z.object({
  cards: z.array(dualCardSchema).min(1, 'At least one card is required'),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const dualCardSectionUpdateSchema = z.object({
  cards: z.array(dualCardSchema).min(1, 'At least one card is required').optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export const dualCardSectionReorderSchema = z.object({
  orders: z.array(z.object({
    id: z.string().uuid(),
    order: z.number().int().min(0),
  })).min(1),
});

export type DualCardSectionCreateDTO = z.infer<typeof dualCardSectionCreateSchema>;
export type DualCardSectionUpdateDTO = z.infer<typeof dualCardSectionUpdateSchema>;
