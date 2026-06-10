import type { Coupon } from '@/types/coupon.types';

export type { Coupon };
export type { CouponFormData, CouponStats } from '@/types/coupon.types';

export type DiscountType = 'percentage' | 'fixed';
export type ApplicableTo = 'all' | 'products' | 'categories';
export type StatusFilter = 'all' | 'active' | 'inactive';

export const getStatusInfo = (coupon: Coupon) => {
  const now = new Date();
  const endDate = new Date(coupon.endDate);

  if (!coupon.isActive) return { color: 'bg-gray-100 text-gray-800', text: 'Inactive' };
  if (endDate < now) return { color: 'bg-red-100 text-red-800', text: 'Expired' };
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
    return { color: 'bg-yellow-100 text-yellow-800', text: 'Limit Reached' };
  return { color: 'bg-green-100 text-green-800', text: 'Active' };
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
  }).format(amount);
