import { z } from 'zod';

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  adminNotes: z.string().max(1000).optional(),
});

export const orderFiltersSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

export type OrderStatusDTO = z.infer<typeof orderStatusSchema>;
export type OrderFiltersDTO = z.infer<typeof orderFiltersSchema>;
