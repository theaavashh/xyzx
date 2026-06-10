import type { Prisma, PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

export interface UserFilters {
  search?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
}

export interface UserSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export type UserPublic = Pick<
  User,
  'id' | 'name' | 'email' | 'role' | 'isActive' | 'permissions' | 'createdAt' | 'updatedAt'
>;

const CACHE_PREFIX = 'user';
const selectPublicFields = {
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    permissions: true,
    createdAt: true,
    updatedAt: true,
  },
};

const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (filters: UserFilters): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = {};

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    where.OR = [
      { name: { contains: searchLower } },
      { email: { contains: searchLower } },
    ];
  }

  if (filters.role) where.role = filters.role;
  if (filters.isActive !== undefined) where.isActive = filters.isActive;

  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.UserOrderByWithRelationInput => {
  const validSortFields = ['createdAt', 'updatedAt', 'name', 'email'];
  const field = validSortFields.includes(sortBy ?? '') ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  return { [field!]: order };
};

const invalidateCache = async (id?: string): Promise<void> => {
  await cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`);
  if (id) {
    await Promise.all([
      cacheService.delete(getCacheKey(`id:${id}`)),
      cacheService.invalidatePattern(`${CACHE_PREFIX}:email:*`),
    ]);
  }
};

export const findUsers = async (
  page: number,
  limit: number,
  filters: UserFilters = {},
  sortOptions: UserSortOptions = {},
): Promise<PaginatedResult<UserPublic>> => {
  const cacheKey = getCacheKey(
    `list:${page}:${limit}:${JSON.stringify(filters)}:${JSON.stringify(sortOptions)}`,
  );

  return cacheService.getOrSet(cacheKey, async () => {
    const where = buildWhereClause(filters);
    const orderBy = buildOrderByClause(
      sortOptions.sortBy,
      sortOptions.sortOrder,
    );
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        ...selectPublicFields,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: data as UserPublic[],
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  });
};

export const findUserById = async (id: string): Promise<UserPublic | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () => {
    const user = await prisma.user.findUnique({
      where: { id },
      ...selectPublicFields,
    });
    return user as UserPublic | null;
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const cacheKey = getCacheKey(`email:${email}`);
  return cacheService.getOrSet(cacheKey, async () => {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  permissions?: string[];
}): Promise<UserPublic> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'user',
      isActive: data.isActive !== undefined ? data.isActive : true,
      permissions: data.permissions ?? [],
    },
    ...selectPublicFields,
  });
  await invalidateCache();
  return user as UserPublic;
};

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: 'user' | 'admin';
    isActive?: boolean;
    permissions?: string[];
  },
): Promise<UserPublic> => {
  const updateData: Prisma.UserUpdateInput = { ...data };
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    ...selectPublicFields,
  });
  await invalidateCache(id);
  return user as UserPublic;
};

export const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({ where: { id } });
  await invalidateCache(id);
};

export const toggleUserStatus = async (id: string): Promise<UserPublic> => {
  const user = await prisma.user.findUnique({
    where: { id },
    ...selectPublicFields,
  });
  if (!user) throw new Error('User not found');

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    ...selectPublicFields,
  });
  await invalidateCache(id);
  return updated as UserPublic;
};

export const updateUserRole = async (
  id: string,
  role: 'user' | 'admin',
): Promise<UserPublic> => {
  const user = await prisma.user.update({
    where: { id },
    data: { role },
    ...selectPublicFields,
  });
  await invalidateCache(id);
  return user as UserPublic;
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.user.count({ where: { id } });
  return count > 0;
};

export const existsByEmail = async (email: string): Promise<boolean> => {
  const count = await prisma.user.count({ where: { email } });
  return count > 0;
};

export const userRepository = {
  findUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserRole,
  existsById,
  existsByEmail,
};
