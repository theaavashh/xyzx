import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  image: z.string().refine((val) => {
    if (!val || val === '') return true;
    return val.startsWith('http') || val.startsWith('data:image') || val.startsWith('/');
  }, 'Image must be a valid URL, data URL, or path').optional().or(z.literal('')),
  internalLink: z.string().min(1, 'Internal link is required').refine((val) => val.startsWith('/') || val.startsWith('http'), 'Internal link must start with / or http'),
  metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').optional().or(z.literal('')),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional().or(z.literal('')),
  keywords: z.string().optional().or(z.literal('')),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const categoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  isActive: z.enum(['true', 'false']).optional(),
});

export const categoryToggleSchema = z.object({
  id: z.string().uuid(),
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
export type CategoryQueryDTO = z.infer<typeof categoryQuerySchema>;
