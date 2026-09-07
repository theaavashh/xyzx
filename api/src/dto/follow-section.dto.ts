import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

const socialLinkSchema = z.object({
  name: z.string().min(1, 'Social link name is required'),
  url: z.string().min(1, 'Social link URL is required'),
  icon: z.string().min(1, 'Social link icon is required'),
  ariaLabel: emptyToUndefined(z.string().optional()),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const followSectionCreateSchema = z.object({
  copyrightText: emptyToUndefined(z.string().max(500).optional()),
  designerCredit: emptyToUndefined(z.string().max(500).optional()),
  showPaymentIcons: z.boolean().optional(),
  isActive: z.boolean().default(true),
  socialLinks: z.array(socialLinkSchema).optional().default([]),
});

export const followSectionUpdateSchema = z.object({
  copyrightText: emptyToUndefined(z.string().max(500).optional()),
  designerCredit: emptyToUndefined(z.string().max(500).optional()),
  showPaymentIcons: z.boolean().optional(),
  isActive: z.boolean().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
});

export type FollowSectionCreateDTO = z.infer<typeof followSectionCreateSchema>;
export type FollowSectionUpdateDTO = z.infer<typeof followSectionUpdateSchema>;
