export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    total: number;
    nprPrice?: number;
    nprTotal?: number;
    currency: string;
    currencySymbol: string;
    product: {
      id: string;
      name: string;
      slug: string;
      images: string[];
      thumbnail?: string;
    };
  }[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  currencySymbol: string;
  nprSubtotal?: number;
  nprTaxAmount?: number;
  nprShippingAmount?: number;
  nprDiscountAmount?: number;
  nprTotalAmount?: number;
  exchangeRate?: number;
  customerCountry?: string;
  notes?: string;
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
