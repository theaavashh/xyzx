export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserProfile = User;

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  wishlistCount: number;
  rewardsBalance: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  itemCount: number;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface ReturnItem {
  id: string;
  returnNumber: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'approved' | 'refunded' | 'rejected';
  amount: number;
  reason: string;
  items: OrderItem[];
}

export interface Cancellation {
  id: string;
  cancellationNumber: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'cancelled' | 'refunded';
  amount: number;
  reason: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  addedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
