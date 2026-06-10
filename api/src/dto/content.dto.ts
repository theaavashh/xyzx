import { z } from 'zod';

export const contentCreateSchema = z.object({
  key: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  content: z.string(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const contentUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const contentUpsertSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().optional(),
});

export const contentToggleSchema = z.object({
  isActive: z.boolean(),
});

export type ContentCreateDTO = z.infer<typeof contentCreateSchema>;
export type ContentUpdateDTO = z.infer<typeof contentUpdateSchema>;
