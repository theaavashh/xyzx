import { z } from 'zod';

export const storeUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(300).optional().nullable(),
  description: z.string().optional(),
  address: z.string().min(1).max(200).optional(),
  city: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(100).optional(),
  zip: z.string().min(1).max(20).optional(),
  country: z.string().min(1).max(100).optional(),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  mapEmbedUrl: z.string().max(1000).optional().nullable(),
  ctaText: z.string().min(1).max(100).optional(),
  ctaUrl: z.string().min(1).max(500).optional(),
  hours: z.any().optional(),
  isActive: z.boolean().optional(),
});

export type StoreUpdateDTO = z.infer<typeof storeUpdateSchema>;
