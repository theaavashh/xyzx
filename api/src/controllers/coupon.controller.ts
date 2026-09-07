import type { Request, RequestHandler, Response } from 'express';
import { couponRepository } from '../repositories/coupon.repository';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

export const validateCoupon: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, subtotal } = req.body;

    if (!code || typeof code !== 'string') {
      sendBadRequest(res, 'Coupon code is required');
      return;
    }

    const coupon = await couponRepository.findCouponByCode(code.toUpperCase().trim());

    if (!coupon) {
      sendBadRequest(res, 'Invalid coupon code');
      return;
    }

    const now = new Date();

    if (!coupon.isActive) {
      sendBadRequest(res, 'This coupon is no longer active');
      return;
    }

    if (now < coupon.startDate) {
      sendBadRequest(res, 'This coupon is not yet valid');
      return;
    }

    if (now > coupon.endDate) {
      sendBadRequest(res, 'This coupon has expired');
      return;
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      sendBadRequest(res, 'This coupon has reached its usage limit');
      return;
    }

    if (coupon.minOrderAmount && (subtotal || 0) < coupon.minOrderAmount) {
      sendBadRequest(res, `Minimum order amount of $${coupon.minOrderAmount.toFixed(2)} required`);
      return;
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (subtotal || 0) * (coupon.value / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = Math.min(coupon.value, subtotal || 0);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    sendSuccess(res, {
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      type: coupon.type,
      value: coupon.value,
      discountAmount,
      description: coupon.description,
    });
  },
);

export const getCoupons: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const couponFilters = {
      search: filters.search as string | undefined,
      isActive:
        filters.isActive === 'true'
          ? true
          : filters.isActive === 'false'
            ? false
            : undefined,
      type: filters.type as string | undefined,
      applicableTo: filters.applicableTo as string | undefined,
    };

    const result = await couponRepository.findCoupons(page, limit, couponFilters, {
      sortBy,
      sortOrder,
    });

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getCouponById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Coupon ID is required');
      return;
    }

    const coupon = await couponRepository.findCouponById(id);

    if (!coupon) {
      sendNotFound(res, 'Coupon not found');
      return;
    }

    sendSuccess(res, coupon);
  },
);

export const getCouponByCode: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const code = req.params.code as string;

    if (!code) {
      sendBadRequest(res, 'Coupon code is required');
      return;
    }

    const coupon = await couponRepository.findCouponByCode(code.toUpperCase());

    if (!coupon) {
      sendNotFound(res, 'Coupon not found');
      return;
    }

    sendSuccess(res, coupon);
  },
);

export const createCoupon: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, name, type, value, minOrderAmount, maxDiscountAmount, usageLimit, startDate, endDate, isActive, applicableTo, applicableItems, description } = req.body;

    const existing = await couponRepository.existsByCode(code.toUpperCase());
    if (existing) {
      sendBadRequest(res, 'A coupon with this code already exists');
      return;
    }

    const coupon = await couponRepository.createCoupon({
      code: code.toUpperCase(),
      name,
      type: type || 'percentage',
      value,
      minOrderAmount: minOrderAmount || undefined,
      maxDiscountAmount: maxDiscountAmount || undefined,
      usageLimit: usageLimit || undefined,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: isActive !== undefined ? isActive : true,
      applicableTo: applicableTo || 'all',
      applicableItems: applicableItems || [],
      description: description || undefined,
    });

    sendCreated(res, coupon, 'Coupon created successfully');
  },
);

export const updateCoupon: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Coupon ID is required');
      return;
    }

    const exists = await couponRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Coupon not found');
      return;
    }

    const { code, name, type, value, minOrderAmount, maxDiscountAmount, usageLimit, startDate, endDate, isActive, applicableTo, applicableItems, description } = req.body;

    if (code) {
      const codeExists = await couponRepository.existsByCode(code.toUpperCase(), id);
      if (codeExists) {
        sendBadRequest(res, 'A coupon with this code already exists');
        return;
      }
    }

    const updateData: Record<string, unknown> = {};
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (value !== undefined) updateData.value = value;
    if (minOrderAmount !== undefined) updateData.minOrderAmount = minOrderAmount || undefined;
    if (maxDiscountAmount !== undefined) updateData.maxDiscountAmount = maxDiscountAmount || undefined;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit || undefined;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (applicableTo !== undefined) updateData.applicableTo = applicableTo;
    if (applicableItems !== undefined) updateData.applicableItems = applicableItems;
    if (description !== undefined) updateData.description = description || undefined;

    const coupon = await couponRepository.updateCoupon(id, updateData);

    sendSuccess(res, coupon, 'Coupon updated successfully');
  },
);

export const deleteCoupon: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Coupon ID is required');
      return;
    }

    const exists = await couponRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Coupon not found');
      return;
    }

    await couponRepository.deleteCoupon(id);

    sendSuccess(res, null, 'Coupon deleted successfully');
  },
);

export const toggleCouponStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Coupon ID is required');
      return;
    }

    try {
      const updated = await couponRepository.toggleCouponStatus(id);

      sendSuccess(
        res,
        updated,
        `Coupon ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      );
    } catch {
      sendNotFound(res, 'Coupon not found');
    }
  },
);

export const getCouponStats: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await couponRepository.getCouponStats();
    sendSuccess(res, stats);
  },
);

export const getActivePublicCoupons: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const coupons = await couponRepository.findActivePublicCoupons();
    const publicCoupons = coupons.map((c) => ({
      code: c.code,
      description: c.description,
      discountType: c.type,
      discountValue: c.value,
    }));
    sendSuccess(res, publicCoupons);
  },
);
