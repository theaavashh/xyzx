import type { Coupon, Prisma } from '@prisma/client';

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

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  totalDiscounts: number;
  expiringSoon: number;
}

export interface ICouponRepository {
  findCoupons(
    page: number,
    limit: number,
    filters?: CouponFilters,
    sortOptions?: CouponSortOptions
  ): Promise<PaginatedResult<Coupon>>;

  findCouponById(id: string): Promise<Coupon | null>;

  findCouponByCode(code: string): Promise<Coupon | null>;

  createCoupon(data: Prisma.CouponCreateInput): Promise<Coupon>;

  updateCoupon(id: string, data: Prisma.CouponUpdateInput): Promise<Coupon>;

  deleteCoupon(id: string): Promise<void>;

  existsById(id: string): Promise<boolean>;

  existsByCode(code: string, excludeId?: string): Promise<boolean>;

  toggleCouponStatus(id: string): Promise<Coupon>;

  getCouponStats(): Promise<CouponStats>;

  findActivePublicCoupons(): Promise<Coupon[]>;

  incrementUsedCount(id: string): Promise<Coupon>;
}

export const COUPON_REPOSITORY_TOKEN = 'COUPON_REPOSITORY';