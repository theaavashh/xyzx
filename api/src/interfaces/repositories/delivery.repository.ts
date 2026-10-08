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

export interface DeliveryStats {
  pending: number;
  processing: number;
  shipped: number;
  inTransit: number;
  outForDelivery: number;
  delivered: number;
  failed: number;
  cancelled: number;
  total: number;
}

export interface IDeliveryRepository {
  createDelivery(data: CreateDeliveryData): Promise<any>;

  getDeliveryByOrderId(orderId: string): Promise<any>;

  getDeliveryById(id: string): Promise<any>;

  updateDeliveryStatus(orderId: string, data: UpdateDeliveryData): Promise<any>;

  getActiveDeliveries(limit?: number, offset?: number): Promise<{ deliveries: any[]; total: number }>;

  getDeliveriesByStatus(status: DeliveryStatus, limit?: number, offset?: number): Promise<{ deliveries: any[]; total: number }>;

  getDeliveryStats(): Promise<DeliveryStats>;

  deleteDelivery(id: string): Promise<any>;
}

export const DELIVERY_REPOSITORY_TOKEN = 'DELIVERY_REPOSITORY';