import type { Request, RequestHandler, Response } from 'express';
import { resolveCouponRepository } from '../di/index.js';
import { ICouponRepository } from '../interfaces/repositories/coupon.repository.js';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

export const validateCoupon: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, subtotal } = req.body as { code?: unknown; subtotal?: unknown };

    if (!code || typeof code !== 'string') {
      sendBadRequest(res, 'Coupon code is required');
      return;
    }

    const couponRepository = await resolveCouponRepository();
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

    const orderSubtotal = typeof subtotal === 'number' ? subtotal : 0;

    if (coupon.minOrderAmount && orderSubtotal < coupon.minOrderAmount) {
      sendBadRequest(
        res,
        `Minimum order amount of $${coupon.minOrderAmount.toFixed(2)} required`,
      );
      return;
    }

    let discountAmount =
      coupon.type === 'percentage'
        ? orderSubtotal * (coupon.value / 100)
        : Math.min(coupon.value, orderSubtotal);

    if (
      coupon.type === 'percentage' &&
      coupon.maxDiscountAmount &&
      discountAmount > coupon.maxDiscountAmount
    ) {
      discountAmount = coupon.maxDiscountAmount;
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
    const couponRepository = await resolveCouponRepository();
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const couponFilters = {
      search: filters.search,
      isActive: filters.isActive ? filters.isActive === 'true' : undefined,
      type: filters.type,
      applicableTo: filters.applicableTo,
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
    const couponRepository = await resolveCouponRepository();
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
    const couponRepository = await resolveCouponRepository();
    const code = req.params.code as string;

    if (!code) {
      sendBadRequest(res, 'Coupon code is required');
      return;
    }

    const coupon = await couponRepository.findCouponByCode(code);

    if (!coupon) {
      sendNotFound(res, 'Coupon not found');
      return;
    }

    sendSuccess(res, coupon);
  },
);

export const createCoupon: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const couponRepository = await resolveCouponRepository();
    const couponData = req.body;

    const exists = await couponRepository.existsByCode(couponData.code);
    if (exists) {
      sendConflict(res, 'Coupon with this code already exists');
      return;
    }

    const coupon = await couponRepository.createCoupon(couponData);
    sendCreated(res, coupon, 'Coupon created successfully');
  },
);

export const updateCoupon: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const couponRepository = await resolveCouponRepository();
    const id = req.params.id as string;
    const couponData = req.body;

    if (!id) {
      sendBadRequest(res, 'Coupon ID is required');
      return;
    }

    const exists = await couponRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Coupon not found');
      return;
    }

    if (couponData.code) {
      const codeExists = await couponRepository.existsByCode(couponData.code, id);
      if (codeExists) {
        sendConflict(res, 'Coupon with this code already exists');
        return;
      }
    }

    const coupon = await couponRepository.updateCoupon(id, couponData);
    sendSuccess(res, coupon, 'Coupon updated successfully');
  },
);

export const deleteCoupon: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const couponRepository = await resolveCouponRepository();
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
    const couponRepository = await resolveCouponRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Coupon ID is required');
      return;
    }

    const coupon = await couponRepository.toggleCouponStatus(id);
    sendSuccess(res, coupon, `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`);
  },
);

export const getCouponStats: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const couponRepository = await resolveCouponRepository();
    const stats = await couponRepository.getCouponStats();
    sendSuccess(res, stats);
  },
);

export const getActivePublicCoupons: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const couponRepository = await resolveCouponRepository();
    const coupons = await couponRepository.findActivePublicCoupons();
    sendSuccess(res, coupons);
  },
);

export const incrementCouponUsedCount: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const couponRepository = await resolveCouponRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Coupon ID is required');
      return;
    }

    const coupon = await couponRepository.incrementUsedCount(id);
    sendSuccess(res, coupon, 'Used count incremented');
  },
);