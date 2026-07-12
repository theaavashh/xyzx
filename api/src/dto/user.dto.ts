import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  role: z.enum(['user', 'admin']).optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const userRoleSchema = z.object({
  role: z.enum(['user', 'admin']),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UserRoleDTO = z.infer<typeof userRoleSchema>;
export type UserQueryDTO = z.infer<typeof userQuerySchema>;
