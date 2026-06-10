import { prisma } from '../lib/database';
import type { Prisma } from '@prisma/client';

export type DeliveryStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED';

export interface LocationUpdate {
  status: string;
  location: string;
  timestamp: string;
  note?: string;
}

export interface CreateDeliveryData {
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface UpdateDeliveryData {
  status?: DeliveryStatus;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
  locationUpdate?: LocationUpdate;
  updatedBy?: string;
}

export const createDelivery = async (data: CreateDeliveryData) => {
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

export const getDeliveryByOrderId = async (orderId: string) => {
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

export const getDeliveryById = async (id: string) => {
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

export const updateDeliveryStatus = async (orderId: string, data: UpdateDeliveryData) => {
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

export const getActiveDeliveries = async (limit: number = 50, offset: number = 0) => {
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

export const getDeliveriesByStatus = async (status: DeliveryStatus, limit: number = 50, offset: number = 0) => {
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

export const getDeliveryStats = async () => {
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

export const deleteDelivery = async (id: string) => {
  return prisma.delivery.delete({ where: { id } });
};

export const deliveryRepository = {
  createDelivery,
  getDeliveryByOrderId,
  getDeliveryById,
  updateDeliveryStatus,
  getActiveDeliveries,
  getDeliveriesByStatus,
  getDeliveryStats,
  deleteDelivery,
};
