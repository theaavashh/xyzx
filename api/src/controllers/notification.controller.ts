import type { Request, RequestHandler, Response } from 'express';
import { notificationRepository } from '../repositories/notification.repository';
import { asyncHandler, sendBadRequest, sendNotFound, sendSuccess } from '../utils';
import { logger } from '../utils/logger';

export const getNotifications: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const unreadOnly = req.query.unread === 'true';
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const result = await notificationRepository.getNotifications(userId, unreadOnly, limit, offset);
    sendSuccess(res, result);
  },
);

export const createNotification: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, title, message, type, link, orderId } = req.body;

    if (!userId || !title || !message) {
      sendBadRequest(res, 'userId, title, and message are required');
      return;
    }

    const notification = await notificationRepository.createNotification({
      userId,
      title,
      message,
      type,
      link,
      orderId,
    });

    logger.info('Notification created', { notificationId: notification.id, userId, type });
    sendSuccess(res, notification, 'Notification created');
  },
);

export const createBulkNotifications: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userIds, title, message, type, link } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      sendBadRequest(res, 'userIds array is required');
      return;
    }

    if (!title || !message) {
      sendBadRequest(res, 'title and message are required');
      return;
    }

    const result = await notificationRepository.createBulkNotifications(userIds, title, message, type, link);
    logger.info('Bulk notifications sent', { count: result.count, type });
    sendSuccess(res, { sentCount: result.count }, 'Bulk notifications sent');
  },
);

export const markAsRead: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    if (!id) {
      sendBadRequest(res, 'Notification ID is required');
      return;
    }

    const notification = await notificationRepository.findById(id);
    if (!notification || notification.userId !== userId) {
      sendNotFound(res, 'Notification not found');
      return;
    }

    await notificationRepository.markAsRead(id);
    sendSuccess(res, null, 'Marked as read');
  },
);

export const markAllAsRead: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const result = await notificationRepository.markAllAsRead(userId);
    sendSuccess(res, { markedCount: result.count }, 'All notifications marked as read');
  },
);

export const markAsUnread: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    if (!id) {
      sendBadRequest(res, 'Notification ID is required');
      return;
    }

    const notification = await notificationRepository.findById(id);
    if (!notification || notification.userId !== userId) {
      sendNotFound(res, 'Notification not found');
      return;
    }

    await notificationRepository.markAsUnread(id);
    sendSuccess(res, null, 'Marked as unread');
  },
);

export const deleteNotification: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    if (!id) {
      sendBadRequest(res, 'Notification ID is required');
      return;
    }

    const notification = await notificationRepository.findById(id);
    if (!notification || notification.userId !== userId) {
      sendNotFound(res, 'Notification not found');
      return;
    }

    await notificationRepository.deleteNotification(id);
    sendSuccess(res, null, 'Notification deleted');
  },
);

export const clearAll: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    await notificationRepository.clearAll(userId);
    sendSuccess(res, null, 'All notifications cleared');
  },
);

export const getUnreadCount: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      sendBadRequest(res, 'User ID is required');
      return;
    }

    const count = await notificationRepository.getUnreadCount(userId);
    sendSuccess(res, { count });
  },
);
