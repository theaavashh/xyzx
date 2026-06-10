import { z } from 'zod';

export const createAddressSchema = z.object({
  type: z.enum(['home', 'office', 'other']),
  name: z.string().min(1, 'Name is required').max(200),
  phone: z.string().min(1, 'Phone is required').max(20),
  street: z.string().min(1, 'Street is required').max(500),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().max(100).optional().default(''),
  zip: z.string().min(1, 'ZIP code is required').max(20),
  country: z.string().min(1, 'Country is required').max(100),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = z.object({
  type: z.enum(['home', 'office', 'other']).optional(),
  name: z.string().min(1).max(200).optional(),
  phone: z.string().min(1).max(20).optional(),
  street: z.string().min(1).max(500).optional(),
  city: z.string().min(1).max(100).optional(),
  state: z.string().max(100).optional(),
  zip: z.string().min(1).max(20).optional(),
  country: z.string().min(1).max(100).optional(),
  isDefault: z.boolean().optional(),
});

export type CreateAddressDTO = z.infer<typeof createAddressSchema>;
export type UpdateAddressDTO = z.infer<typeof updateAddressSchema>;
