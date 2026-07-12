export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export interface CouponResponse {
  success: boolean;
  data?: Coupon | Coupon[];
}
