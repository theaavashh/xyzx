import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive().min(1).max(99),
  size: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().min(1).max(99),
});

export const cartItemIdSchema = z.object({
  itemId: z.string().uuid('Invalid item ID'),
});

export type AddToCartDTO = z.infer<typeof addToCartSchema>;
export type UpdateCartItemDTO = z.infer<typeof updateCartItemSchema>;
export type CartItemIdDTO = z.infer<typeof cartItemIdSchema>;
