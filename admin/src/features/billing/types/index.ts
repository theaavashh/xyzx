export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string | null;
  userId: string | null;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string | null;
  shippingCountry: string;
  shippingZip: string;
  billingName: string | null;
  billingEmail: string | null;
  billingPhone: string | null;
  billingAddress: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingCountry: string | null;
  billingZip: string | null;
  notes: string | null;
  adminNotes: string | null;
  paymentMethod: string | null;
  paidAt: string | null;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  orderItems: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      sku: string | null;
      images: string[];
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  byStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    refunded: number;
  };
}

export interface OrderPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
