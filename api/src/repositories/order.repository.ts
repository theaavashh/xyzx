import type { Order, OrderItem, OrderStatus, Prisma } from '@prisma/client';
import { cacheService } from '../services/cache.service';
import { prisma } from '../lib/database';

export interface OrderFilters {
  search?: string;
  userId?: string;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface OrderSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

type OrderWithRelations = Order & {
  user: { id: string; name: string; email: string } | null;
  orderItems: (OrderItem & {
    product: { id: string; name: string; sku: string | null; images: string[] };
  })[];
};

const CACHE_PREFIX = 'order';
const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const selectOrderRelations = {
  user: { select: { id: true, name: true, email: true } },
  orderItems: {
    include: {
      product: { select: { id: true, name: true, sku: true, images: true } },
    },
  },
};

const buildWhereClause = (filters: OrderFilters): Prisma.OrderWhereInput => {
  const where: Prisma.OrderWhereInput = {};
  if (filters.userId) where.userId = filters.userId;
  if (filters.status) where.status = filters.status;
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    where.OR = [
      { orderNumber: { contains: searchLower } },
      { shippingName: { contains: searchLower } },
      { shippingEmail: { contains: searchLower } },
    ];
  }
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = filters.startDate;
    if (filters.endDate) where.createdAt.lte = filters.endDate;
  }
  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.OrderOrderByWithRelationInput => {
  const validSortFields = [
    'createdAt',
    'updatedAt',
    'orderNumber',
    'total',
    'status',
  ];
  const field = validSortFields.includes(sortBy ?? '') ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  return { [field!]: order };
};

const invalidateCache = async (id?: string): Promise<void> => {
  await cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`);
  if (id) await cacheService.delete(getCacheKey(`id:${id}`));
};

export const findOrders = async (
  page: number,
  limit: number,
  filters: OrderFilters = {},
  sortOptions: OrderSortOptions = {},
): Promise<PaginatedResult<OrderWithRelations>> => {
  const cacheKey = getCacheKey(
    `list:${page}:${limit}:${JSON.stringify(filters)}:${JSON.stringify(sortOptions)}`,
  );

  return cacheService.getOrSet(cacheKey, async () => {
    const where = buildWhereClause(filters);
    const orderBy = buildOrderByClause(
      sortOptions.sortBy,
      sortOptions.sortOrder,
    );
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: selectOrderRelations,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: data as OrderWithRelations[],
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  });
};

export const findOrderById = async (
  id: string,
): Promise<OrderWithRelations | null> => {
  const cacheKey = getCacheKey(`id:${id}`);
  return cacheService.getOrSet(cacheKey, async () => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: selectOrderRelations,
    });
    return order as OrderWithRelations | null;
  });
};

export const findOrderByNumber = async (
  orderNumber: string,
): Promise<OrderWithRelations | null> => {
  const cacheKey = getCacheKey(`orderNumber:${orderNumber}`);
  return cacheService.getOrSet(cacheKey, async () => {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: selectOrderRelations,
    });
    return order as OrderWithRelations | null;
  });
};

export const createOrder = async (data: {
  orderNumber: string;
  userId?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState?: string;
  shippingCountry: string;
  shippingZip: string;
  billingName?: string;
  billingEmail?: string;
  billingPhone?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingZip?: string;
  notes?: string;
  paymentMethod?: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
}): Promise<Order> => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber: data.orderNumber,
        userId: data.userId,
        subtotal: data.subtotal,
        tax: data.tax,
        shipping: data.shipping,
        total: data.total,
        currency: data.currency,
        shippingName: data.shippingName,
        shippingEmail: data.shippingEmail,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingState: data.shippingState,
        shippingCountry: data.shippingCountry,
        shippingZip: data.shippingZip,
        billingName: data.billingName,
        billingEmail: data.billingEmail,
        billingPhone: data.billingPhone,
        billingAddress: data.billingAddress,
        billingCity: data.billingCity,
        billingState: data.billingState,
        billingCountry: data.billingCountry,
        billingZip: data.billingZip,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'PENDING',
      },
    });

    await tx.orderItem.createMany({
      data: data.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return order;
  });
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  adminNotes?: string,
): Promise<OrderWithRelations> => {
  const order = await prisma.order.update({
    where: { id },
    data: { status, adminNotes },
    include: selectOrderRelations,
  });
  await invalidateCache(id);
  return order as OrderWithRelations;
};

export const cancelOrder = async (
  id: string,
  reason?: string,
): Promise<OrderWithRelations> => {
  const order = await prisma.order.update({
    where: { id },
    data: {
      status: 'CANCELLED' as OrderStatus,
      adminNotes: reason ? `Order cancelled: ${reason}` : 'Order cancelled',
    },
    include: selectOrderRelations,
  });
  await invalidateCache(id);
  return order as OrderWithRelations;
};

export const getOrderItems = async (
  orderId: string,
): Promise<Array<{ productId: string; quantity: number }>> => {
  const items = await prisma.orderItem.findMany({
    where: { orderId },
    select: { productId: true, quantity: true },
  });
  return items.map((item) => ({
    productId: item.productId as string,
    quantity: item.quantity,
  }));
};

export const existsById = async (id: string): Promise<boolean> => {
  const count = await prisma.order.count({ where: { id } });
  return count > 0;
};

export const existsByOrderNumber = async (
  orderNumber: string,
): Promise<boolean> => {
  const count = await prisma.order.count({ where: { orderNumber } });
  return count > 0;
};

export const orderRepository = {
  findOrders,
  findOrderById,
  findOrderByNumber,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderItems,
  existsById,
  existsByOrderNumber,
};
