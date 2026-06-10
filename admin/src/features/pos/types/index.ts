export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
  category?: { name: string };
}

export interface CartItem extends Product {
  quantity: number;
}

export type PaymentMethod = 'cash' | 'card' | 'esewa' | 'khalti' | 'bank_transfer';

export interface SaleData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  items: CartItem[];
  createdAt: string;
}

export interface SaleRecord {
  id: string;
  orderNumber: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingName: string;
  shippingPhone: string;
  createdAt: string;
  notes?: string;
  orderItems: Array<{
    productId: string;
    quantity: number;
    price: number;
    product: { id: string; name: string; sku: string | null; images: string[] };
  }>;
}

export type Tab = 'new-sale' | 'history';

export interface ListResponse {
  success: boolean;
  data: { data: SaleRecord[]; pagination: { total: number; pages: number; page: number; limit: number } };
}

export interface SaleDetailResponse {
  success: boolean;
  data: SaleRecord;
}

export interface CreateSaleResponse {
  success: boolean;
  data: SaleRecord;
  message?: string;
}
