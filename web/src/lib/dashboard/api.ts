import { apiRequest, ApiError } from '@/lib/api';
import type {
  DashboardStats,
  Order,
  OrderItem,
  ReturnItem,
  Cancellation,
  WishlistItem,
  Address,
  User,
  PaginationParams,
  PaginatedResponse,
} from './types';

async function safeRequest<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    return await apiRequest<T>(url, options);
  } catch (error) {
    if (error instanceof ApiError && (error.isNotFound || error.isServerError)) {
      return null;
    }
    throw error;
  }
}

async function fetchPaginated<T>(
  endpoint: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<T>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const queryString = query.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  const response = await safeRequest<{
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(url);

  if (!response) {
    return { success: false, data: [], total: 0, page: 1, limit: params?.limit ?? 10, totalPages: 0 };
  }

  return {
    success: response.success,
    data: response.data,
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await safeRequest<{ success: boolean; data: DashboardStats }>(
    '/api/v1/user/dashboard/stats',
  );
  return response?.data ?? { totalOrders: 0, pendingOrders: 0, completedOrders: 0, wishlistCount: 0, rewardsBalance: 0 };
}

type ApiOrderItem = {
  id: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
  product?: { id: string; name: string; images?: string[] } | null;
};

type ApiOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  paymentMethod?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  shippingName?: string | null;
  shippingPhone?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingZip?: string | null;
  shippingCountry?: string | null;
  billingName?: string | null;
  billingPhone?: string | null;
  billingAddress?: string | null;
  billingCity?: string | null;
  billingState?: string | null;
  billingZip?: string | null;
  billingCountry?: string | null;
  orderItems?: ApiOrderItem[];
};

function mapAddress(role: 'shipping' | 'billing', api: ApiOrder): Address {
  const name = role === 'shipping' ? api.shippingName : api.billingName;
  const phone = role === 'shipping' ? api.shippingPhone : api.billingPhone;
  const street = role === 'shipping' ? api.shippingAddress : api.billingAddress;
  const city = role === 'shipping' ? api.shippingCity : api.billingCity;
  const state = role === 'shipping' ? api.shippingState : api.billingState;
  const zip = role === 'shipping' ? api.shippingZip : api.billingZip;
  const country = role === 'shipping' ? api.shippingCountry : api.billingCountry;

  return {
    id: `${role}-address`,
    type: 'home',
    name: name ?? api.shippingName ?? '',
    phone: phone ?? api.shippingPhone ?? '',
    street: street ?? api.shippingAddress ?? '',
    city: city ?? api.shippingCity ?? '',
    state: state ?? api.shippingState ?? '',
    zip: zip ?? api.shippingZip ?? '',
    country: country ?? api.shippingCountry ?? '',
    isDefault: false,
  };
}

function mapApiOrder(api: ApiOrder): Order {
  const items: OrderItem[] = (api.orderItems ?? []).map((oi) => ({
    id: oi.id,
    productId: oi.product?.id ?? '',
    productName: oi.product?.name ?? 'Product',
    productImage: oi.product?.images?.[0] ?? '',
    quantity: oi.quantity,
    price: oi.price,
    size: oi.size ?? undefined,
    color: oi.color ?? undefined,
  }));

  return {
    id: api.id,
    orderNumber: api.orderNumber,
    date: api.createdAt,
    status: (api.status?.toLowerCase() ?? 'pending') as Order['status'],
    total: api.total,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    items,
    shippingAddress: mapAddress('shipping', api),
    billingAddress: mapAddress('billing', api),
    paymentMethod: api.paymentMethod ?? 'N/A',
    trackingNumber: api.trackingNumber ?? undefined,
    trackingUrl: api.trackingUrl ?? undefined,
  };
}

export const fetchOrders = async (
  params?: PaginationParams,
): Promise<PaginatedResponse<Order>> => {
  const result = await fetchPaginated<ApiOrder>('/api/v1/orders/me', params);
  return { ...result, data: result.data.map(mapApiOrder) };
};
export const fetchReturns = (params?: PaginationParams) => fetchPaginated<ReturnItem>('/api/v1/user/returns', params);
export const fetchCancellations = (params?: PaginationParams) => fetchPaginated<Cancellation>('/api/v1/user/cancellations', params);
export const fetchWishlist = (params?: PaginationParams) => fetchPaginated<WishlistItem>('/api/v1/user/wishlist', params);

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const response = await safeRequest<{ success: boolean; data: ApiOrder }>(
    `/api/v1/orders/${orderId}`,
  );
  return response?.data ? mapApiOrder(response.data) : null;
}

export async function addToWishlist(productId: string): Promise<void> {
  try {
    await apiRequest('/api/v1/user/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  } catch {
    // silently fail if endpoint doesn't exist
  }
}

export async function removeFromWishlist(itemId: string): Promise<void> {
  try {
    await apiRequest(`/api/v1/user/wishlist/${itemId}`, {
      method: 'DELETE',
    });
  } catch {
    // silently fail
  }
}

export async function fetchAddresses(): Promise<Address[]> {
  try {
    const response = await apiRequest<{ success: boolean; data: Address[] }>(
      '/api/v1/user/addresses',
    );
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) {
      return [];
    }
    throw error;
  }
}

export async function addAddress(address: Omit<Address, 'id'>): Promise<Address> {
  const response = await apiRequest<{ success: boolean; data: Address }>(
    '/api/v1/user/addresses',
    {
      method: 'POST',
      body: JSON.stringify(address),
    },
  );
  return response.data;
}

export async function updateAddress(id: string, address: Partial<Address>): Promise<Address> {
  const response = await apiRequest<{ success: boolean; data: Address }>(
    `/api/v1/user/addresses/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(address),
    },
  );
  return response.data;
}

export async function deleteAddress(id: string): Promise<void> {
  await apiRequest(`/api/v1/user/addresses/${id}`, {
    method: 'DELETE',
  });
}

export async function setDefaultAddress(id: string): Promise<void> {
  await apiRequest(`/api/v1/user/addresses/${id}/default`, {
    method: 'PUT',
  });
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await apiRequest<{ success: boolean; data: User }>(
    '/api/v1/users/profile',
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  );
  return response.data;
}

export async function changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
  await apiRequest('/api/v1/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiRequest('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(data: { token: string; password: string }): Promise<void> {
  await apiRequest('/api/v1/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
