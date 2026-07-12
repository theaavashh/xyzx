import { prisma } from '../lib/database';
import type { Prisma } from '@prisma/client';

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type?: 'ORDER' | 'SYSTEM' | 'PROMO' | 'STOCK' | 'DELIVERY' | 'PAYMENT';
  link?: string;
  orderId?: string;
}

export const getNotifications = async (
  userId: string,
  unreadOnly: boolean = false,
  limit: number = 50,
  offset: number = 0,
) => {
  const where: Prisma.NotificationWhereInput = { userId };
  if (unreadOnly) where.isRead = false;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return { notifications, total, unreadCount };
};

export const createNotification = async (data: CreateNotificationData) => {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || 'SYSTEM',
      link: data.link,
      orderId: data.orderId,
    },
  });
};

export const createBulkNotifications = async (
  userIds: string[],
  title: string,
  message: string,
  type: 'ORDER' | 'SYSTEM' | 'PROMO' | 'STOCK' | 'DELIVERY' | 'PAYMENT' = 'SYSTEM',
  link?: string,
) => {
  return prisma.notification.createMany({
    data: userIds.map((userId) => ({
      userId,
      title,
      message,
      type,
      link,
    })),
  });
};

export const markAsRead = async (notificationId: string) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export const markAllAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const markAsUnread = async (notificationId: string) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: false },
  });
};

export const deleteNotification = async (notificationId: string) => {
  return prisma.notification.delete({ where: { id: notificationId } });
};

export const clearAll = async (userId: string) => {
  return prisma.notification.deleteMany({ where: { userId } });
};

export const findById = async (id: string) => {
  return prisma.notification.findUnique({ where: { id } });
};

export const getUnreadCount = async (userId: string) => {
  return prisma.notification.count({ where: { userId, isRead: false } });
};

export const notificationRepository = {
  getNotifications,
  createNotification,
  createBulkNotifications,
  markAsRead,
  markAllAsRead,
  markAsUnread,
  deleteNotification,
  clearAll,
  getUnreadCount,
  findById,
};
