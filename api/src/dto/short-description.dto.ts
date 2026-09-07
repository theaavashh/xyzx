import { z } from 'zod';

export const shortDescriptionUpdateSchema = z.object({
  description: z.string().max(2000),
});

export type ShortDescriptionUpdateDTO = z.infer<typeof shortDescriptionUpdateSchema>;
