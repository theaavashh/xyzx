import type { Request, RequestHandler, Response } from 'express';
import { asyncHandler, sendBadRequest, sendNotFound, sendSuccess } from '../utils';
import { logger } from '../utils/logger';
import { orderRepository } from '../repositories/order.repository';
import { inventoryRepository } from '../repositories/inventory.repository';

export const createPosSale: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { items, customerName, customerPhone, subtotal, tax, discount, total, paymentMethod } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      sendBadRequest(res, 'Unauthorized');
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      sendBadRequest(res, 'Items array is required');
      return;
    }

    try {
      const orderNumber = `POS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const order = await orderRepository.createOrder({
        orderNumber,
        userId,
        subtotal,
        tax,
        shipping: 0,
        total,
        currency: 'NPR',
        shippingName: customerName || 'Walk-in Customer',
        shippingEmail: `${orderNumber.toLowerCase()}@pos.local`,
        shippingPhone: customerPhone || undefined,
        shippingAddress: 'In-store purchase',
        shippingCity: 'Store',
        shippingCountry: 'Nepal',
        shippingZip: '00000',
        billingName: customerName || 'Walk-in Customer',
        billingPhone: customerPhone || undefined,
        paymentMethod: paymentMethod || 'cash',
        notes: JSON.stringify({ discount, paymentMethod, type: 'pos_sale' }),
        items: items.map((item: { productId: string; quantity: number; price: number }) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      await inventoryRepository.deductStockForOrder(items, order.id, 'STORE');

      await orderRepository.updateOrderStatus(order.id, 'CONFIRMED');

      const fullOrder = await orderRepository.findOrderById(order.id);

      logger.info('POS sale completed', { orderId: order.id, total, itemCount: items.length });

      sendSuccess(res, fullOrder, 'Sale completed');
    } catch (error) {
      const err = error as Error;
      logger.error('POS sale failed', undefined, err);
      sendBadRequest(res, err.message);
    }
  },
);

export const listPosSales: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search as string | undefined;

    const result = await orderRepository.findOrders(
      page,
      limit,
      {
        status: 'CONFIRMED',
        ...(search && { search }),
      },
      { sortBy: 'createdAt', sortOrder: 'desc' },
    );

    const posSales = result.data.filter((o) => (o.orderNumber ?? '').startsWith('POS-'));

    sendSuccess(res, {
      data: posSales,
      pagination: {
        ...result.pagination,
        total: posSales.length,
        pages: Math.ceil(posSales.length / limit),
      },
    });
  },
);

export const getPosSale: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const order = await orderRepository.findOrderById(id);

    if (!order) {
      sendNotFound(res, 'Sale not found');
      return;
    }

    sendSuccess(res, order);
  },
);
