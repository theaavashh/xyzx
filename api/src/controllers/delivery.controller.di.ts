import type { Request, RequestHandler, Response } from 'express';
import { resolveDeliveryRepository } from '../di/index.js';
import { IDeliveryRepository, DeliveryStatus } from '../interfaces/repositories/delivery.repository.js';
import {
  asyncHandler,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

export const createDelivery: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const deliveryRepository = await resolveDeliveryRepository();
    const data = req.body;

    if (!data.orderId) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    const delivery = await deliveryRepository.createDelivery(data);
    sendSuccess(res, delivery, 'Delivery created successfully');
  },
);

export const getDeliveryByOrderId: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const deliveryRepository = await resolveDeliveryRepository();
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
    const deliveryRepository = await resolveDeliveryRepository();
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
    const deliveryRepository = await resolveDeliveryRepository();
    const orderId = req.params.orderId as string;
    const data = req.body;

    if (!orderId) {
      sendBadRequest(res, 'Order ID is required');
      return;
    }

    const delivery = await deliveryRepository.updateDeliveryStatus(orderId, data);
    sendSuccess(res, delivery, 'Delivery status updated successfully');
  },
);

export const getActiveDeliveries: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const deliveryRepository = await resolveDeliveryRepository();
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const page = Math.floor(offset / limit) + 1;

    const result = await deliveryRepository.getActiveDeliveries(limit, offset);
    sendSuccess(res, result.deliveries, undefined, 200, { 
      total: result.total, 
      limit, 
      page, 
      pages: Math.ceil(result.total / limit) 
    });
  },
);

export const getDeliveriesByStatus: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const deliveryRepository = await resolveDeliveryRepository();
    const status = req.query.status as DeliveryStatus;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const page = Math.floor(offset / limit) + 1;

    if (!status) {
      sendBadRequest(res, 'Status is required');
      return;
    }

    const result = await deliveryRepository.getDeliveriesByStatus(status, limit, offset);
    sendSuccess(res, result.deliveries, undefined, 200, { 
      total: result.total, 
      limit, 
      page, 
      pages: Math.ceil(result.total / limit) 
    });
  },
);

export const getDeliveryStats: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const deliveryRepository = await resolveDeliveryRepository();
    const stats = await deliveryRepository.getDeliveryStats();
    sendSuccess(res, stats);
  },
);

export const deleteDelivery: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const deliveryRepository = await resolveDeliveryRepository();
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Delivery ID is required');
      return;
    }

    await deliveryRepository.deleteDelivery(id);
    sendSuccess(res, null, 'Delivery deleted successfully');
  },
);