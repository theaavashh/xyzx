import { z } from 'zod';

export const contactPageUpdateSchema = z.object({
  pageTitle: z.string().max(200).optional().nullable(),
  pageSubtitle: z.string().max(500).optional().nullable(),
  email: z.string().max(200).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  subjectOptions: z.string().max(1000).optional(),
  successTitle: z.string().max(200).optional().nullable(),
  successMessage: z.string().max(1000).optional().nullable(),
  isActive: z.boolean().optional(),
});

export type ContactPageUpdateDTO = z.infer<typeof contactPageUpdateSchema>;
