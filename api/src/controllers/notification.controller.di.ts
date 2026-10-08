import type { Request, RequestHandler, Response } from 'express';
import { resolveNotificationRepository } from '../di/index.js';
import { INotificationRepository } from '../interfaces/repositories/notification.repository.js';
import {
  asyncHandler,
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from '../utils/index.js';

export const getNotifications: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationRepository = await resolveNotificationRepository();
    const userId = req.user?.userId;
    
    if (!userId) {
      sendBadRequest(res, 'User not authenticated');
      return;
    }

    const unreadOnly = req.query.unreadOnly === 'true';
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await notificationRepository.getNotifications(userId, unreadOnly, limit, offset);
    sendSuccess(res, { 
      notifications: result.notifications,
      unreadCount: result.unreadCount 
    }, undefined, 200, { 
      total: result.total, 
      limit, 
      page: Math.floor(offset / limit) + 1,
      pages: Math.ceil(result.total / limit)
    });
  },
);

export const createNotification: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationRepository = await resolveNotificationRepository();
    const data = req.body;

    if (!data.userId || !data.title || !data.message) {
      sendBadRequest(res, 'userId, title, and message are required');
      return;
    }

    const notification = await notificationRepository.createNotification(data);
    sendSuccess(res, notification, 'Notification created');
  },
);

export const createBulkNotifications: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationRepository = await resolveNotificationRepository();
    const { userIds, title, message, type, link } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      sendBadRequest(res, 'userIds array is required');
      return;
    }

    if (!title || !message) {
      sendBadRequest(res, 'title and message are required');
      return;
    }

    const result = await notificationRepository.createBulkNotifications(userIds, title, message, type || 'SYSTEM', link);
    sendSuccess(res, result, 'Bulk notifications created');
  },
);

export const markAsRead: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationRepository = await resolveNotificationRepository();
    const notificationId = req.params.id as string;

    if (!notificationId) {
      sendBadRequest(res, 'Notification ID is required');
      return;
    }

    const notification = await notificationRepository.markAsRead(notificationId);
    if (!notification) {
      sendNotFound(res, 'Notification not found');
      return;
    }

    sendSuccess(res, notification, 'Marked as read');
  },
);

export const markAllAsRead: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationRepository = await resolveNotificationRepository();
    const userId = req.user?.userId;

    if (!userId) {
      sendBadRequest(res, 'User not authenticated');
      return;
    }

    await notificationRepository.markAllAsRead(userId);
    sendSuccess(res, null, 'All marked as read');
  },
);

export const markAsUnread: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationRepository = await resolveNotificationRepository();
    const notificationId = req.params.id as string;

    if (!notificationId) {
      sendBadRequest(res, 'Notification ID is required');
      return;
    }

    const notification = await notificationRepository.markAsUnread(notificationId);
    if (!notification) {
      sendNotFound(res, 'Notification not found');
      return;
    }

    sendSuccess(res, notification, 'Marked as unread');
  },
);

export const deleteNotification: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationRepository = await resolveNotificationRepository();
    const notificationId = req.params.id as string;

    if (!notificationId) {
      sendBadRequest(res, 'Notification ID is required');
      return;
    }

    await notificationRepository.deleteNotification(notificationId);
    sendSuccess(res, null, 'Notification deleted');
  },
);

export const clearAllNotifications: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationRepository = await resolveNotificationRepository();
    const userId = req.user?.userId;

    if (!userId) {
      sendBadRequest(res, 'User not authenticated');
      return;
    }

    await notificationRepository.clearAll(userId);
    sendSuccess(res, null, 'All notifications cleared');
  },
);

export const getUnreadCount: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const notificationRepository = await resolveNotificationRepository();
    const userId = req.user?.userId;

    if (!userId) {
      sendBadRequest(res, 'User not authenticated');
      return;
    }

    const count = await notificationRepository.getUnreadCount(userId);
    sendSuccess(res, { unreadCount: count });
  },
);