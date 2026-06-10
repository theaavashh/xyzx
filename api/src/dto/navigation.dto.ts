import { z } from 'zod';

const navigationLinkSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1).max(200),
  href: z.string().min(1).max(500),
  order: z.number().int().min(0).default(0),
});

const navigationColumnSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  href: z.string().max(500).default(''),
  order: z.number().int().min(0).default(0),
  links: z.array(navigationLinkSchema).default([]),
});

export const navigationCreateSchema = z.object({
  name: z.string().min(1).max(200),
  href: z.string().min(1).max(500),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  columns: z.array(navigationColumnSchema).default([]),
});

export const navigationUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  href: z.string().min(1).max(500).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  columns: z.array(navigationColumnSchema).optional(),
});

export const navigationReorderSchema = z.object({
  orders: z.array(z.object({
    id: z.string().uuid(),
    order: z.number().int().min(0),
  })).min(1),
});

export type NavigationCreateDTO = z.infer<typeof navigationCreateSchema>;
export type NavigationUpdateDTO = z.infer<typeof navigationUpdateSchema>;
