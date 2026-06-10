import { z } from 'zod';

export const shippingItemCreateSchema = z.object({
  type: z.enum(['method', 'info', 'region']),
  name: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(200).optional(),
  region: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  time: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const shippingItemUpdateSchema = z.object({
  type: z.enum(['method', 'info', 'region']).optional(),
  name: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(200).optional(),
  region: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  time: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const shippingSettingsUpdateSchema = z.object({
  freeShippingThreshold: z.string().optional(),
  freeInternationalThreshold: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
});

export type ShippingItemCreateDTO = z.infer<typeof shippingItemCreateSchema>;
export type ShippingItemUpdateDTO = z.infer<typeof shippingItemUpdateSchema>;
export type ShippingSettingsUpdateDTO = z.infer<typeof shippingSettingsUpdateSchema>;
