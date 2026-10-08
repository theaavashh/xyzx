import type { Order, OrderItem, OrderStatus, Prisma } from '@prisma/client';

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

export type OrderWithRelations = Order & {
  user: { id: string; name: string; email: string } | null;
  orderItems: (OrderItem & {
    product: { id: string; name: string; sku: string | null; images: string[] };
  })[];
};

export interface IOrderRepository {
  findOrders(
    page: number,
    limit: number,
    filters?: OrderFilters,
    sortOptions?: OrderSortOptions
  ): Promise<PaginatedResult<OrderWithRelations>>;

  findOrderById(id: string): Promise<OrderWithRelations | null>;

  findOrderByNumber(orderNumber: string): Promise<OrderWithRelations | null>;

  createOrder(data: {
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
  }): Promise<Order>;

  updateOrderStatus(
    id: string,
    status: OrderStatus,
    adminNotes?: string
  ): Promise<OrderWithRelations>;

  cancelOrder(id: string, reason?: string): Promise<OrderWithRelations>;

  getOrderItems(orderId: string): Promise<Array<{ productId: string; quantity: number }>>;

  existsById(id: string): Promise<boolean>;

  existsByOrderNumber(orderNumber: string): Promise<boolean>;
}

export const ORDER_REPOSITORY_TOKEN = 'ORDER_REPOSITORY';