import type { Request, RequestHandler, Response } from 'express';
import { deliveryRepository } from '../repositories/delivery.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { asyncHandler, sendBadRequest, sendNotFound, sendSuccess } from '../utils';
import { logger } from '../utils/logger';

export const createDelivery: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId, trackingNumber, carrier, estimatedDelivery, notes } = req.body;

    if (!orderId) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    const delivery = await deliveryRepository.createDelivery({
      orderId,
      trackingNumber,
      carrier,
      estimatedDelivery,
      notes,
    });

    logger.info('Delivery created', { deliveryId: delivery.id, orderId });

    if (delivery.order.userId) {
      notificationRepository.createNotification({
        userId: delivery.order.userId,
        title: 'Shipment Created',
        message: `Your order #${delivery.order.orderNumber} shipment has been created.`,
        type: 'DELIVERY',
        orderId,
      }).catch(() => {});
    }

    sendSuccess(res, delivery, 'Delivery created');
  },
);

export const getDeliveryByOrder: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string;
    if (!orderId) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    const delivery = await deliveryRepository.getDeliveryByOrderId(orderId);
    if (!delivery) {
      sendNotFound(res, 'Delivery not found for this order');
      return;
    }

    sendSuccess(res, delivery);
  },
);

export const getDeliveryById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      sendBadRequest(res, 'Delivery ID is required');
      return;
    }

    const delivery = await deliveryRepository.getDeliveryById(id);
    if (!delivery) {
      sendNotFound(res, 'Delivery not found');
      return;
    }

    sendSuccess(res, delivery);
  },
);

export const updateDeliveryStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string;
    const { status, trackingNumber, carrier, estimatedDelivery, notes, locationUpdate } = req.body;

    if (!orderId) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    const validStatuses = [
      'PENDING', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT',
      'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED',
    ];

    if (status && !validStatuses.includes(status)) {
      sendBadRequest(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      return;
    }

    const delivery = await deliveryRepository.updateDeliveryStatus(orderId, {
      status,
      trackingNumber,
      carrier,
      estimatedDelivery,
      notes,
      locationUpdate,
      updatedBy: req.user?.userId || 'admin',
    });

    const statusMessages: Record<string, string> = {
      SHIPPED: 'Your order has been shipped!',
      IN_TRANSIT: 'Your order is in transit.',
      OUT_FOR_DELIVERY: 'Your order is out for delivery!',
      DELIVERED: 'Your order has been delivered!',
      FAILED: 'Delivery attempt failed.',
    };

    if (status && statusMessages[status]) {
      if (delivery.order.userId) {
        notificationRepository.createNotification({
          userId: delivery.order.userId,
          title: `Delivery Update: ${status.replace(/_/g, ' ')}`,
          message: statusMessages[status],
          type: 'DELIVERY',
          orderId,
        }).catch(() => {});
      }
    }

    logger.info('Delivery status updated', { orderId, status, updatedBy: req.user?.userId });
    sendSuccess(res, delivery, 'Delivery status updated');
  },
);

export const getActiveDeliveries: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const result = await deliveryRepository.getActiveDeliveries(limit, offset);
    sendSuccess(res, result);
  },
);

export const getDeliveriesByStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const status = req.params.status as string;
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const validStatuses = [
      'PENDING', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT',
      'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED',
    ];

    if (!validStatuses.includes(status)) {
      sendBadRequest(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      return;
    }

    const result = await deliveryRepository.getDeliveriesByStatus(status as any, limit, offset);
    sendSuccess(res, result);
  },
);

export const getDeliveryStats: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await deliveryRepository.getDeliveryStats();
    sendSuccess(res, stats);
  },
);

export const deleteDelivery: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      sendBadRequest(res, 'Delivery ID is required');
      return;
    }

    await deliveryRepository.deleteDelivery(id);
    sendSuccess(res, null, 'Delivery deleted');
  },
);
