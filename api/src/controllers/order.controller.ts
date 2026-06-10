import type { OrderStatus } from '@prisma/client';
import type { Request, RequestHandler, Response } from 'express';
import { orderRepository } from '../repositories/order.repository';
import { rewardService } from '../services/reward.service';
import { inventoryRepository } from '../repositories/inventory.repository';
import { logger } from '../utils/logger';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

const VALID_ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

export const getOrders: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const orderFilters = {
      search: filters.search,
      userId: filters.userId as string | undefined,
      status: filters.status as OrderStatus | undefined,
      startDate: filters.startDate
        ? new Date(filters.startDate as string)
        : undefined,
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

    sendSuccess(res, order);
  },
);

export const createOrder: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      userId,
      subtotal,
      tax,
      shipping,
      total,
      currency,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingCountry,
      shippingZip,
      billingName,
      billingEmail,
      billingPhone,
      billingAddress,
      billingCity,
      billingState,
      billingCountry,
      billingZip,
      notes,
      paymentMethod,
      items,
    } = req.body;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await orderRepository.createOrder({
      orderNumber,
      userId,
      subtotal,
      tax: tax || 0,
      shipping: shipping || 0,
      total,
      currency: currency || 'USD',
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingCountry,
      shippingZip,
      billingName,
      billingEmail,
      billingPhone,
      billingAddress,
      billingCity,
      billingState,
      billingCountry,
      billingZip,
      notes,
      paymentMethod,
      items,
    });

    rewardService.addOrderReward(order.id, userId, total).catch((error) => {
      logger.error('Failed to add rewards for order', { orderId: order.id }, error);
    });

    inventoryRepository.deductStockForOrder(
      items.map((item: { productId: string; quantity: number }) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      order.id,
      'ONLINE',
    ).catch((error) => {
      logger.error('Failed to deduct stock for order', { orderId: order.id }, error);
    });

    sendCreated(res, order, 'Order created successfully');
  },
);

export const updateOrderStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status, adminNotes } = req.body;

    if (!id) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    if (!status || !VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
      sendBadRequest(res, 'Invalid status');
      return;
    }

    const exists = await orderRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Order not found');
      return;
    }

    const order = await orderRepository.updateOrderStatus(
      id,
      status as OrderStatus,
      adminNotes,
    );

    sendSuccess(res, order, 'Order status updated successfully');
  },
);

export const cancelOrder: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
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

    orderRepository.getOrderItems(id).then((items) => {
      if (items && Array.isArray(items)) {
        inventoryRepository.restoreStockForOrder(
          items.map((item: { productId: string; quantity: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          id,
          reason || 'Order cancelled',
        ).catch((error) => {
          logger.error('Failed to restore stock for cancelled order', { orderId: id }, error);
        });
      }
    });

    sendSuccess(res, order, 'Order cancelled successfully');
  },
);
