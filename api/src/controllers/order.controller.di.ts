import type { Request, RequestHandler, Response } from 'express';
import { resolveCouponRepository, resolveInventoryRepository, resolveOrderRepository } from '../di/index.js';
import { IOrderRepository } from '../interfaces/repositories/order.repository.js';
import type { OrderStatus } from '@prisma/client';
import { rewardService } from '../services/reward.service.js';
import { notifyNewOrder } from '../services/order-notification.service.js';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from '../utils/index.js';
import { logger } from '../utils/logger.js';

export const getOrders: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const orderRepository = await resolveOrderRepository();
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const orderFilters = {
      search: filters.search,
      userId: filters.userId,
      status: filters.status as OrderStatus | undefined,
      startDate: filters.startDate ? new Date(filters.startDate as string) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate as string) : undefined,
    };

    const result = await orderRepository.findOrders(page, limit, orderFilters, {
      sortBy,
      sortOrder,
    });

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getOrderById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const orderRepository = await resolveOrderRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    const order = await orderRepository.findOrderById(id);

    if (!order) {
      sendNotFound(res, 'Order not found');
      return;
    }

    if (req.user?.role !== 'admin' && order.userId && order.userId !== req.user?.userId) {
      sendNotFound(res, 'Order not found');
      return;
    }

    sendSuccess(res, order);
  },
);

export const getOrderByNumber: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const orderRepository = await resolveOrderRepository();
    const orderNumber = req.params.orderNumber as string;

    if (!orderNumber) {
      sendBadRequest(res, 'Order number is required');
      return;
    }

    const order = await orderRepository.findOrderByNumber(orderNumber);

    if (!order) {
      sendNotFound(res, 'Order not found');
      return;
    }

    sendSuccess(res, order);
  },
);

export const getMyOrders: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendUnauthorized(res, 'Authentication required');
      return;
    }

    const orderRepository = await resolveOrderRepository();
    const { page, limit, sortBy, sortOrder } = parseQuery(req);

    const result = await orderRepository.findOrders(
      page,
      limit,
      { userId },
      { sortBy, sortOrder },
    );

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

interface CreateOrderBody {
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  currency?: string;
  shippingName?: string;
  shippingEmail?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  shippingZip?: string;
  billingName?: string;
  billingEmail?: string;
  billingPhone?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingZip?: string;
  notes?: string;
  paymentMethod?: string;
  couponId?: string;
  items?: Array<{ productId: string; quantity: number; price: number }>;
}

export const createOrder: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const body: CreateOrderBody = req.body ?? {};
    const items = body.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      sendBadRequest(res, 'Order items are required');
      return;
    }

    if (items.some((item) => typeof item?.price !== 'number')) {
      sendBadRequest(res, 'Each order item requires a price');
      return;
    }

    if (typeof body.subtotal !== 'number' || typeof body.total !== 'number') {
      sendBadRequest(res, 'Subtotal and total are required');
      return;
    }

    if (!body.shippingName || !body.shippingEmail || !body.shippingAddress) {
      sendBadRequest(res, 'Shipping details are required');
      return;
    }

    const orderRepository = await resolveOrderRepository();
    const userId = req.user?.userId;
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

    logger.debug('Creating order', { items: items.length });

    const order = await orderRepository.createOrder({
      orderNumber,
      userId,
      subtotal: body.subtotal,
      tax: body.tax || 0,
      shipping: body.shipping || 0,
      total: body.total,
      currency: body.currency || 'USD',
      shippingName: body.shippingName,
      shippingEmail: body.shippingEmail,
      shippingPhone: body.shippingPhone,
      shippingAddress: body.shippingAddress,
      shippingCity: body.shippingCity || '',
      shippingState: body.shippingState,
      shippingCountry: body.shippingCountry || '',
      shippingZip: body.shippingZip || '',
      billingName: body.billingName,
      billingEmail: body.billingEmail,
      billingPhone: body.billingPhone,
      billingAddress: body.billingAddress,
      billingCity: body.billingCity,
      billingState: body.billingState,
      billingCountry: body.billingCountry,
      billingZip: body.billingZip,
      notes: body.notes,
      paymentMethod: body.paymentMethod,
      items,
    });

    notifyNewOrder(order).catch((error) => {
      logger.error('Failed to notify admins of new order', { orderId: order.id }, error);
    });

    if (userId) {
      rewardService.addOrderReward(order.id, userId, body.total).catch((error) => {
        logger.error('Failed to add rewards for order', { orderId: order.id }, error);
      });
    }

    // Stock deduction is synchronous — if it fails, cancel the order
    const inventoryRepository = await resolveInventoryRepository();
    const stockResult = await inventoryRepository.deductStockForOrder(
      items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      order.id,
      'ONLINE',
    );

    if (!stockResult.success) {
      await orderRepository.cancelOrder(order.id, 'Insufficient stock');
      sendBadRequest(res, 'One or more items are out of stock');
      return;
    }

    if (body.couponId) {
      const couponId = body.couponId;
      const couponRepository = await resolveCouponRepository();
      couponRepository.incrementUsedCount(couponId).catch((error) => {
        logger.error('Failed to increment coupon usage', { couponId, orderId: order.id }, error);
      });
    }

    sendCreated(res, order, 'Order created successfully');
  },
);

export const updateOrderStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const orderRepository = await resolveOrderRepository();
    const id = req.params.id as string;
    const { status, adminNotes } = req.body;

    if (!id) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    if (!status) {
      sendBadRequest(res, 'Status is required');
      return;
    }

    const exists = await orderRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Order not found');
      return;
    }

    const order = await orderRepository.updateOrderStatus(id, status, adminNotes);

    sendSuccess(res, order, 'Order status updated successfully');
  },
);

export const cancelOrder: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const orderRepository = await resolveOrderRepository();
    const id = req.params.id as string;
    const { reason } = req.body;

    if (!id) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    const exists = await orderRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Order not found');
      return;
    }

    const order = await orderRepository.cancelOrder(id, reason);

    sendSuccess(res, order, 'Order cancelled successfully');
  },
);

export const getOrderItems: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const orderRepository = await resolveOrderRepository();
    const orderId = req.params.id as string;

    if (!orderId) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    const items = await orderRepository.getOrderItems(orderId);

    sendSuccess(res, items);
  },
);