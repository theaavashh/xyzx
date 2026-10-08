import type { Prisma } from '@prisma/client';
import { INotificationRepository, CreateNotificationData, NotificationListResult, NOTIFICATION_REPOSITORY_TOKEN } from '../interfaces/repositories/notification.repository.js';
import { PrismaClient } from '@prisma/client';

export const createNotificationRepository = (prisma: PrismaClient): INotificationRepository => {
  const getNotifications = async (
    userId: string,
    unreadOnly: boolean = false,
    limit: number = 50,
    offset: number = 0,
  ): Promise<NotificationListResult> => {
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

  const createNotification = async (data: CreateNotificationData) => {
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

  const createBulkNotifications = async (
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

  const markAsRead = async (notificationId: string) => {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  };

  const markAllAsRead = async (userId: string) => {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  };

  const markAsUnread = async (notificationId: string) => {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: false },
    });
  };

  const deleteNotification = async (notificationId: string) => {
    return prisma.notification.delete({ where: { id: notificationId } });
  };

  const clearAll = async (userId: string) => {
    return prisma.notification.deleteMany({ where: { userId } });
  };

  const findById = async (id: string) => {
    return prisma.notification.findUnique({ where: { id } });
  };

  const getUnreadCount = async (userId: string) => {
    return prisma.notification.count({ where: { userId, isRead: false } });
  };

  return {
    getNotifications,
    createNotification,
    createBulkNotifications,
    markAsRead,
    markAllAsRead,
    markAsUnread,
    deleteNotification,
    clearAll,
    findById,
    getUnreadCount,
  };
};

export { NOTIFICATION_REPOSITORY_TOKEN };