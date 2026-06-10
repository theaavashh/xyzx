import { z } from 'zod';

export const editorialSectionCreateSchema = z.object({
  season: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional().nullable(),
  ctaText: z.string().max(100).optional().nullable(),
  ctaLink: z.string().max(500).optional().nullable(),
  images: z.array(z.object({
    id: z.string(),
    src: z.string(),
    alt: z.string(),
    link: z.string().optional(),
  })).optional().default([]),
  featureType: z.string().optional().nullable(),
  productIds: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional().default(0),
});

export const editorialSectionUpdateSchema = z.object({
  season: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional().nullable(),
  ctaText: z.string().max(100).optional().nullable(),
  ctaLink: z.string().max(500).optional().nullable(),
  images: z.array(z.object({
    id: z.string(),
    src: z.string(),
    alt: z.string(),
    link: z.string().optional(),
  })).optional(),
  featureType: z.string().optional().nullable(),
  productIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
});

export const editorialSectionReorderSchema = z.object({
  orders: z.array(z.object({
    id: z.string().uuid(),
    order: z.number().int().min(0),
  })).min(1),
});

export type EditorialSectionCreateDTO = z.infer<typeof editorialSectionCreateSchema>;
export type EditorialSectionUpdateDTO = z.infer<typeof editorialSectionUpdateSchema>;
