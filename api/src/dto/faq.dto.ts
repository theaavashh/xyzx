import { z } from 'zod';

export const faqCreateSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1),
  category: z.string().min(1).max(100),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const faqUpdateSchema = z.object({
  question: z.string().min(1).max(500).optional(),
  answer: z.string().min(1).optional(),
  category: z.string().min(1).max(100).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type FaqCreateDTO = z.infer<typeof faqCreateSchema>;
export type FaqUpdateDTO = z.infer<typeof faqUpdateSchema>;
