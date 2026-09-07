import type { Coupon, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

export interface CouponFilters {
  search?: string;
  isActive?: boolean;
  type?: string;
  applicableTo?: string;
}

export interface CouponSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

const CACHE_PREFIX = 'coupon';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (filters: CouponFilters): Prisma.CouponWhereInput => {
  const where: Prisma.CouponWhereInput = {};
  if (filters.search) {
    where.OR = [
      { code: { contains: filters.search } },
      { name: { contains: filters.search } },
    ];
  }
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  if (filters.type) where.type = filters.type;
  if (filters.applicableTo) where.applicableTo = filters.applicableTo;
  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.CouponOrderByWithRelationInput => {
  const validSortFields = ['createdAt', 'updatedAt', 'code', 'name', 'value', 'usedCount', 'startDate', 'endDate'];
  const field = validSortFields.includes(sortBy ?? '') ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  return { [field!]: order };
};

const invalidateCache = async (): Promise<void> => {
  await Promise.all([
    cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`),
    cacheService.invalidatePattern(`${CACHE_PREFIX}:id*`),
  ]);
};

export const findCoupons = async (
  page: number,
  limit: number,
  filters: CouponFilters = {},
  sortOptions: CouponSortOptions = {},
): Promise<PaginatedResult<Coupon>> => {
  const cacheKey = getCacheKey(
    `list:${page}:${limit}:${JSON.stringify(filters)}:${JSON.stringify(sortOptions)}`,
  );

  return cacheService.getOrSet(cacheKey, async () => {
    const where = buildWhereClause(filters);
    const orderBy = buildOrderByClause(sortOptions.sortBy, sortOptions.sortOrder);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.coupon.findMany({ where, orderBy, skip, take: limit }),
      prisma.coupon.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  });
};

export const findCouponById = async (id: string): Promise<Coupon | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () =>
    prisma.coupon.findUnique({ where: { id } }),
  );
};

export const findCouponByCode = async (code: string): Promise<Coupon | null> => {
  return prisma.coupon.findUnique({ where: { code } });
};

export const createCoupon = async (
  data: Prisma.CouponCreateInput,
): Promise<Coupon> => {
  const coupon = await prisma.coupon.create({ data });
  await invalidateCache();
  return coupon;
};

export const updateCoupon = async (
  id: string,
  data: Prisma.CouponUpdateInput,
): Promise<Coupon> => {
  const coupon = await prisma.coupon.update({ where: { id }, data });
  await invalidateCache();
  return coupon;
};

export const deleteCoupon = async (id: string): Promise<void> => {
  await prisma.coupon.delete({ where: { id } });
  await invalidateCache();
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.coupon.count({ where: { id } });
  return count > 0;
};

export const existsByCode = async (code: string, excludeId?: string): Promise<boolean> => {
  const where: Prisma.CouponWhereInput = { code };
  if (excludeId) where.id = { not: excludeId };
  const count = await prisma.coupon.count({ where });
  return count > 0;
};

export const toggleCouponStatus = async (id: string): Promise<Coupon> => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new Error('Coupon not found');
  const updated = await prisma.coupon.update({
    where: { id },
    data: { isActive: !coupon.isActive },
  });
  await invalidateCache();
  return updated;
};

export const getCouponStats = async () => {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [totalCoupons, activeCoupons, totalUsage, expiringSoon] = await Promise.all([
    prisma.coupon.count(),
    prisma.coupon.count({ where: { isActive: true, endDate: { gte: now }, startDate: { lte: now } } }),
    prisma.coupon.aggregate({ _sum: { usedCount: true } }),
    prisma.coupon.count({
      where: { isActive: true, endDate: { gte: now, lte: sevenDaysLater } },
    }),
  ]);

  return {
    totalCoupons,
    activeCoupons,
    totalDiscounts: totalUsage._sum.usedCount || 0,
    expiringSoon,
  };
};

export const findActivePublicCoupons = async (): Promise<Coupon[]> => {
  const now = new Date();
  return prisma.coupon.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
};

export const incrementUsedCount = async (id: string): Promise<Coupon> => {
  const coupon = await prisma.coupon.update({
    where: { id },
    data: { usedCount: { increment: 1 } },
  });
  await invalidateCache();
  return coupon;
};

export const couponRepository = {
  findCoupons,
  findCouponById,
  findCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  existsById,
  existsByCode,
  toggleCouponStatus,
  getCouponStats,
  findActivePublicCoupons,
  incrementUsedCount,
};
