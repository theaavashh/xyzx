import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

const serviceItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Service title is required'),
  description: z.string().min(1, 'Service description is required'),
  image: z.string().min(1, 'Service image is required'),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

const socialLinkSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Social link name is required'),
  url: z.string().min(1, 'Social link URL is required'),
  icon: z.string().min(1, 'Social link icon is required'),
  ariaLabel: emptyToUndefined(z.string().optional()),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const followSectionCreateSchema = z.object({
  brandName: z.string().min(1).max(200),
  street: emptyToUndefined(z.string().max(500).optional()),
  city: emptyToUndefined(z.string().max(200).optional()),
  state: emptyToUndefined(z.string().max(200).optional()),
  zip: emptyToUndefined(z.string().max(20).optional()),
  country: emptyToUndefined(z.string().max(200).optional()),
  copyrightText: emptyToUndefined(z.string().max(500).optional()),
  designerCredit: emptyToUndefined(z.string().max(500).optional()),
  showPaymentIcons: z.boolean().optional(),
  isActive: z.boolean().default(true),
  serviceItems: z.array(serviceItemSchema).optional().default([]),
  socialLinks: z.array(socialLinkSchema).optional().default([]),
});

export const followSectionUpdateSchema = z.object({
  brandName: emptyToUndefined(z.string().min(1).max(200).optional()),
  street: emptyToUndefined(z.string().max(500).optional()),
  city: emptyToUndefined(z.string().max(200).optional()),
  state: emptyToUndefined(z.string().max(200).optional()),
  zip: emptyToUndefined(z.string().max(20).optional()),
  country: emptyToUndefined(z.string().max(200).optional()),
  copyrightText: emptyToUndefined(z.string().max(500).optional()),
  designerCredit: emptyToUndefined(z.string().max(500).optional()),
  showPaymentIcons: z.boolean().optional(),
  isActive: z.boolean().optional(),
  serviceItems: z.array(serviceItemSchema).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
});

export type FollowSectionCreateDTO = z.infer<typeof followSectionCreateSchema>;
export type FollowSectionUpdateDTO = z.infer<typeof followSectionUpdateSchema>;
