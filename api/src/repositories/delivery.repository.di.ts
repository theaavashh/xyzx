import { Prisma } from '@prisma/client';
import { IDeliveryRepository, DELIVERY_REPOSITORY_TOKEN, DeliveryStatus, CreateDeliveryData, UpdateDeliveryData, LocationUpdate } from '../interfaces/repositories/delivery.repository.js';
import { PrismaClient } from '@prisma/client';

export const createDeliveryRepository = (prisma: PrismaClient): IDeliveryRepository => {
  const createDelivery = async (data: CreateDeliveryData) => {
    return prisma.delivery.create({
      data: {
        orderId: data.orderId,
        trackingNumber: data.trackingNumber,
        carrier: data.carrier,
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined,
        notes: data.notes,
        locationHistory: [],
      },
      include: {
        order: {
          select: { userId: true, orderNumber: true, status: true },
        },
      },
    });
  };

  const getDeliveryByOrderId = async (orderId: string) => {
    return prisma.delivery.findUnique({
      where: { orderId },
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
            shippingName: true,
            shippingAddress: true,
            shippingCity: true,
            shippingCountry: true,
            shippingZip: true,
          },
        },
      },
    });
  };

  const getDeliveryById = async (id: string) => {
    return prisma.delivery.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
            shippingName: true,
            shippingAddress: true,
            shippingCity: true,
            shippingCountry: true,
            shippingZip: true,
          },
        },
      },
    });
  };

  const updateDeliveryStatus = async (orderId: string, data: UpdateDeliveryData) => {
    const existing = await prisma.delivery.findUnique({
      where: { orderId },
      select: { locationHistory: true },
    });

    const locationHistory = (existing?.locationHistory as unknown as LocationUpdate[]) || [];

    if (data.locationUpdate) {
      locationHistory.push({
        ...data.locationUpdate,
        timestamp: data.locationUpdate.timestamp || new Date().toISOString(),
      });
    } else if (data.status) {
      locationHistory.push({
        status: data.status,
        location: 'System Update',
        timestamp: new Date().toISOString(),
        note: data.notes || undefined,
      });
    }

    const updateData: Prisma.DeliveryUpdateInput = {
      ...(data.status && { status: data.status }),
      ...(data.trackingNumber && { trackingNumber: data.trackingNumber }),
      ...(data.carrier && { carrier: data.carrier }),
      ...(data.estimatedDelivery && { estimatedDelivery: new Date(data.estimatedDelivery) }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.updatedBy && { updatedBy: data.updatedBy }),
      locationHistory: locationHistory as any,
    };

    if (data.status === 'DELIVERED') {
      updateData.actualDelivery = new Date();
    }

    return prisma.delivery.update({
      where: { orderId },
      data: updateData,
      include: {
        order: {
          select: {
            userId: true,
            orderNumber: true,
            status: true,
            shippingName: true,
            shippingAddress: true,
            shippingCity: true,
            shippingCountry: true,
            shippingZip: true,
          },
        },
      },
    });
  };

  const getActiveDeliveries = async (limit: number = 50, offset: number = 0) => {
    const where: Prisma.DeliveryWhereInput = {
      status: { notIn: ['DELIVERED', 'CANCELLED'] },
    };

    const [deliveries, total] = await Promise.all([
      prisma.delivery.findMany({
        where,
        include: {
          order: {
            select: {
              orderNumber: true,
              status: true,
              shippingName: true,
              shippingCity: true,
              shippingCountry: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.delivery.count({ where }),
    ]);

    return { deliveries, total };
  };

  const getDeliveriesByStatus = async (status: DeliveryStatus, limit: number = 50, offset: number = 0) => {
    const [deliveries, total] = await Promise.all([
      prisma.delivery.findMany({
        where: { status },
        include: {
          order: {
            select: {
              orderNumber: true,
              status: true,
              shippingName: true,
              shippingCity: true,
              shippingCountry: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.delivery.count({ where: { status } }),
    ]);

    return { deliveries, total };
  };

  const getDeliveryStats = async () => {
    const [pending, processing, shipped, inTransit, outForDelivery, delivered, failed, cancelled] =
      await Promise.all([
        prisma.delivery.count({ where: { status: 'PENDING' } }),
        prisma.delivery.count({ where: { status: 'PROCESSING' } }),
        prisma.delivery.count({ where: { status: 'SHIPPED' } }),
        prisma.delivery.count({ where: { status: 'IN_TRANSIT' } }),
        prisma.delivery.count({ where: { status: 'OUT_FOR_DELIVERY' } }),
        prisma.delivery.count({ where: { status: 'DELIVERED' } }),
        prisma.delivery.count({ where: { status: 'FAILED' } }),
        prisma.delivery.count({ where: { status: 'CANCELLED' } }),
      ]);

    return {
      pending,
      processing,
      shipped,
      inTransit,
      outForDelivery,
      delivered,
      failed,
      cancelled,
      total: pending + processing + shipped + inTransit + outForDelivery + delivered + failed + cancelled,
    };
  };

  const deleteDelivery = async (id: string) => {
    return prisma.delivery.delete({ where: { id } });
  };

  return {
    createDelivery,
    getDeliveryByOrderId,
    getDeliveryById,
    updateDeliveryStatus,
    getActiveDeliveries,
    getDeliveriesByStatus,
    getDeliveryStats,
    deleteDelivery,
  };
};

export { DELIVERY_REPOSITORY_TOKEN };