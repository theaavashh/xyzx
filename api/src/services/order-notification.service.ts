import type { Order } from '@prisma/client';
import { prisma } from '../lib/database';
import { broadcastNewOrder } from './websocket.service';
import { emailService } from './email.service';
import { logger } from '../utils/logger';

export interface OrderNotificationPayload {
  id: string;
  orderNumber: string;
  total: number;
  currency: string;
  status: string;
  shippingName: string;
  createdAt: Date;
}

const toPayload = (order: Order): OrderNotificationPayload => ({
  id: order.id,
  orderNumber: order.orderNumber,
  total: order.total,
  currency: order.currency,
  status: order.status,
  shippingName: order.shippingName,
  createdAt: order.createdAt,
});

export const notifyNewOrder = async (order: Order): Promise<void> => {
  const payload = toPayload(order);

  broadcastNewOrder(payload);

  try {
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: { select: { name: true, images: true } },
          },
        },
      },
    });

    if (fullOrder) {
      const items = fullOrder.orderItems.map((item) => ({
        name: item.product?.name || 'Product',
        quantity: item.quantity,
        price: item.price,
        image: Array.isArray(item.product?.images) ? (item.product.images as string[])[0] : undefined,
      }));

      await emailService.sendOrderInvoice(fullOrder.shippingEmail, {
        orderNumber: fullOrder.orderNumber,
        createdAt: fullOrder.createdAt,
        status: fullOrder.status,
        currency: fullOrder.currency,
        shippingName: fullOrder.shippingName,
        shippingEmail: fullOrder.shippingEmail,
        shippingPhone: fullOrder.shippingPhone,
        shippingAddress: fullOrder.shippingAddress,
        shippingCity: fullOrder.shippingCity,
        shippingState: fullOrder.shippingState,
        shippingCountry: fullOrder.shippingCountry,
        shippingZip: fullOrder.shippingZip,
        items,
        subtotal: fullOrder.subtotal,
        tax: fullOrder.tax,
        shipping: fullOrder.shipping,
        total: fullOrder.total,
      });
    }
  } catch (error) {
    logger.error('Failed to send order invoice to customer', { orderId: order.id }, error as Error);
  }

  try {
    const admins = await prisma.user.findMany({
      where: { role: 'admin', isActive: true },
      select: { email: true },
    });

    if (admins.length === 0) return;

    await emailService.sendAdminNewOrderEmail(payload, admins.map((a) => a.email));
  } catch (error) {
    logger.error('Failed to notify admins of new order', { orderId: order.id }, error as Error);
  }
};