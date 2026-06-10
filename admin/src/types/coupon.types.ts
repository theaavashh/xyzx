export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableTo: 'all' | 'products' | 'categories';
  applicableItems: string[];
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CouponFormData {
  code: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableTo: 'all' | 'products' | 'categories';
  applicableItems: string[];
  description?: string;
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  totalDiscounts: number;
  expiringSoon: number;
}

export interface CouponResponse {
  success: boolean;
  data: Coupon[];
  message: string;
}

export interface CouponSingleResponse {
  success: boolean;
  data: Coupon;
  message: string;
}

export interface CouponStatsResponse {
  success: boolean;
  data: CouponStats;
  message: string;
}
