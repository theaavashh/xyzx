import type { Coupon, CouponResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export async function fetchActiveCoupons(): Promise<Coupon[]> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/public/coupons/active`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) return [];

    const json: CouponResponse = await response.json();

    if (!json.success || !json.data) return [];

    const coupons = Array.isArray(json.data) ? json.data : [json.data];
    return coupons;
  } catch {
    return [];
  }
}
