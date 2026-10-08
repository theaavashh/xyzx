import type { Prisma } from '@prisma/client';

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type?: 'ORDER' | 'SYSTEM' | 'PROMO' | 'STOCK' | 'DELIVERY' | 'PAYMENT';
  link?: string;
  orderId?: string;
}

export interface NotificationListResult {
  notifications: any[];
  total: number;
  unreadCount: number;
}

export interface INotificationRepository {
  getNotifications(
    userId: string,
    unreadOnly: boolean,
    limit: number,
    offset: number
  ): Promise<NotificationListResult>;

  createNotification(data: CreateNotificationData): Promise<any>;

  createBulkNotifications(
    userIds: string[],
    title: string,
    message: string,
    type: 'ORDER' | 'SYSTEM' | 'PROMO' | 'STOCK' | 'DELIVERY' | 'PAYMENT',
    link?: string
  ): Promise<any>;

  markAsRead(notificationId: string): Promise<any>;

  markAllAsRead(userId: string): Promise<any>;

  markAsUnread(notificationId: string): Promise<any>;

  deleteNotification(notificationId: string): Promise<any>;

  clearAll(userId: string): Promise<any>;

  findById(id: string): Promise<any>;

  getUnreadCount(userId: string): Promise<number>;
}

export const NOTIFICATION_REPOSITORY_TOKEN = 'NOTIFICATION_REPOSITORY';