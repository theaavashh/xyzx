import type { handleUnaryCall } from '@grpc/grpc-js';
import { orderRepository } from '../repositories/order.repository';
import { rewardService } from '../services/reward.service';
import { inventoryRepository } from '../repositories/inventory.repository';
import { logger } from '../utils/logger';
import type { Pagination, ApiError } from './types';

interface Order { id: string; orderNumber: string; status: string; total: number; [key: string]: any }
interface CreateOrderItem { productId: string; productName?: string; sku?: string; price: number; quantity: number }
interface GetOrderRequest { id: string }
interface PaginationRequest { page: number; limit: number; search: string; sortBy: string; sortOrder: string }
interface CreateOrderRequest { userId?: string; subtotal: number; tax: number; shipping: number; total: number; currency?: string; shippingName?: string; shippingEmail?: string; shippingPhone?: string; shippingAddress?: string; shippingCity?: string; shippingState?: string; shippingCountry?: string; shippingZip?: string; billingName?: string; billingEmail?: string; billingPhone?: string; billingAddress?: string; billingCity?: string; billingState?: string; billingCountry?: string; billingZip?: string; notes?: string; paymentMethod?: string; items: CreateOrderItem[] }
interface UpdateOrderStatusRequest { id: string; status: string; adminNotes?: string }
interface CancelOrderRequest { id: string; reason?: string }
interface OrderResponse { success: boolean; message: string; data: Order | null; error: ApiError | null }
interface ListOrdersResponse { success: boolean; message: string; data: Order[]; pagination: Pagination | null; error: ApiError | null }

export const getOrder: handleUnaryCall<GetOrderRequest, OrderResponse> = async (call, callback) => {
  try {
    const { id } = call.request;
    if (!id) { callback(null, { success: false, message: 'Order ID is required', data: null, error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    const order = await orderRepository.findOrderById(id);
    if (!order) { callback(null, { success: false, message: 'Order not found', data: null, error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    callback(null, { success: true, message: 'OK', data: order as any, error: null });
  } catch (error) {
    logger.error('gRPC GetOrder error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const listOrders: handleUnaryCall<PaginationRequest, ListOrdersResponse> = async (call, callback) => {
  try {
    const { page, limit, search, sortBy, sortOrder } = call.request;
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    const filters: any = {};
    if (search) filters.search = search;
    const result = await orderRepository.findOrders(currentPage, currentLimit, filters, { sortBy: sortBy || 'createdAt', sortOrder: (sortOrder as 'asc' | 'desc') || 'desc' });
    callback(null, { success: true, message: 'OK', data: result.data as any[], pagination: { page: currentPage, limit: currentLimit, total: result.pagination.total, totalPages: result.pagination.pages }, error: null });
  } catch (error) {
    logger.error('gRPC ListOrders error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: [], pagination: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const createOrder: handleUnaryCall<CreateOrderRequest, OrderResponse> = async (call, callback) => {
  try {
    const data = call.request;
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const order = await orderRepository.createOrder({
      orderNumber,
      userId: data.userId || '', subtotal: data.subtotal || 0, tax: data.tax || 0, shipping: data.shipping || 0, total: data.total || 0,
      currency: data.currency || 'USD',
      shippingName: data.shippingName || '', shippingEmail: data.shippingEmail || '', shippingPhone: data.shippingPhone || '',
      shippingAddress: data.shippingAddress || '', shippingCity: data.shippingCity || '', shippingState: data.shippingState || '',
      shippingCountry: data.shippingCountry || '', shippingZip: data.shippingZip || '',
      billingName: data.billingName || '', billingEmail: data.billingEmail || '', billingPhone: data.billingPhone || '',
      billingAddress: data.billingAddress || '', billingCity: data.billingCity || '', billingState: data.billingState || '',
      billingCountry: data.billingCountry || '', billingZip: data.billingZip || '',
      notes: data.notes || '', paymentMethod: data.paymentMethod || '',
      items: (data.items || []).map(i => ({ productId: i.productId, productName: i.productName || '', sku: i.sku || '', price: i.price, quantity: i.quantity })),
    });
    if (data.total) {
      rewardService.addOrderReward(order.id, data.userId || '', data.total || 0).catch(e => logger.error('Rewards failed', { orderId: order.id }, e));
      const stockResult = await inventoryRepository.deductStockForOrder((data.items || []).map(i => ({ productId: i.productId, quantity: i.quantity })), order.id, 'ONLINE');
      if (!stockResult.success) {
        await orderRepository.cancelOrder(order.id, 'Insufficient stock');
        callback(null, { success: false, message: 'One or more items are out of stock', data: null, error: { message: 'Out of stock', code: 'FAILED_PRECONDITION', details: {} } });
        return;
      }
    }
    callback(null, { success: true, message: 'Order created', data: order as any, error: null });
  } catch (error) {
    logger.error('gRPC CreateOrder error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const updateOrderStatus: handleUnaryCall<UpdateOrderStatusRequest, OrderResponse> = async (call, callback) => {
  try {
    const { id, status, adminNotes } = call.request;
    if (!id) { callback(null, { success: false, message: 'Order ID is required', data: null, error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    if (!status) { callback(null, { success: false, message: 'Status is required', data: null, error: { message: 'Missing status', code: 'INVALID', details: {} } }); return; }
    const exists = await orderRepository.existsById(id);
    if (!exists) { callback(null, { success: false, message: 'Order not found', data: null, error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    const order = await orderRepository.updateOrderStatus(id, status as any, adminNotes);
    callback(null, { success: true, message: 'Status updated', data: order as any, error: null });
  } catch (error) {
    logger.error('gRPC UpdateOrderStatus error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const cancelOrder: handleUnaryCall<CancelOrderRequest, OrderResponse> = async (call, callback) => {
  try {
    const { id, reason } = call.request;
    if (!id) { callback(null, { success: false, message: 'Order ID is required', data: null, error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    const exists = await orderRepository.existsById(id);
    if (!exists) { callback(null, { success: false, message: 'Order not found', data: null, error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    const order = await orderRepository.cancelOrder(id, reason);
    orderRepository.getOrderItems(id).then(items => {
      if (items && Array.isArray(items)) inventoryRepository.restoreStockForOrder(items.map((i: any) => ({ productId: i.productId, quantity: i.quantity })), id, reason || 'Cancelled').catch(e => logger.error('Stock restore failed', { orderId: id }, e));
    });
    callback(null, { success: true, message: 'Order cancelled', data: order as any, error: null });
  } catch (error) {
    logger.error('gRPC CancelOrder error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const orderHandlers = {
  GetOrder: getOrder,
  ListOrders: listOrders,
  CreateOrder: createOrder,
  UpdateOrderStatus: updateOrderStatus,
  CancelOrder: cancelOrder,
};
