import { z } from 'zod';

export const createAttributeOptionSchema = z.object({
  type: z.string().min(1).max(100),
  value: z.string().min(1).max(255),
  label: z.string().max(255).optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const attributeOptionQuerySchema = z.object({
  type: z.string().optional(),
  isActive: z.string().optional(),
});

export type CreateAttributeOptionDTO = z.infer<typeof createAttributeOptionSchema>;
