import { z } from 'zod';

export const contactCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(255),
  subject: z.string().min(1).max(300),
  message: z.string().min(1).max(5000),
});

export type ContactCreateDTO = z.infer<typeof contactCreateSchema>;
