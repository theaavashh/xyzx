import { z } from 'zod';

export const couponCreateSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50).transform((v) => v.toUpperCase()),
  name: z.string().min(1, 'Name is required').max(200),
  type: z.enum(['percentage', 'fixed']).default('percentage'),
  value: z.number().positive('Value must be positive'),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(0).optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isActive: z.boolean().default(true),
  applicableTo: z.enum(['all', 'products', 'categories']).default('all'),
  applicableItems: z.array(z.string()).default([]),
  description: z.string().max(500).optional(),
});

export const couponUpdateSchema = z.object({
  code: z.string().min(1).max(50).transform((v) => v.toUpperCase()).optional(),
  name: z.string().min(1).max(200).optional(),
  type: z.enum(['percentage', 'fixed']).optional(),
  value: z.number().positive().optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(0).optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  isActive: z.boolean().optional(),
  applicableTo: z.enum(['all', 'products', 'categories']).optional(),
  applicableItems: z.array(z.string()).optional(),
  description: z.string().max(500).optional(),
});

export type CouponCreateDTO = z.infer<typeof couponCreateSchema>;
export type CouponUpdateDTO = z.infer<typeof couponUpdateSchema>;
