import { z } from 'zod';

export const womenItemsUpdateSchema = z.object({
  image: z.string().min(1, 'Image is required'),
  description: z.string().min(1, 'Description is required'),
  buttonTitle: z.string().min(1, 'Button title is required'),
  buttonCta: z.string().min(1, 'Button CTA is required'),
  filterType: z.enum(['gender', 'category']),
  filterValue: z.string().min(1, 'Filter value is required'),
});

export type WomenItemsUpdateDTO = z.infer<typeof womenItemsUpdateSchema>;
