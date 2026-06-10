import { useState } from 'react';
import type { Invoice } from '../types';

const mockInvoices: Invoice[] = [
  {
    id: '1', invoiceNumber: 'INV-2024-001', orderId: 'ORD-12345',
    customerName: 'John Doe', customerEmail: 'john@example.com',
    date: '2024-01-15', dueDate: '2024-01-30',
    items: [{ id: '1', productName: 'iPhone 15 Pro', quantity: 1, unitPrice: 99900, total: 99900 },
            { id: '2', productName: 'AirPods Pro', quantity: 2, unitPrice: 9900, total: 19800 }],
    subtotal: 119700, tax: 14364, total: 134064, status: 'paid',
    paymentMethod: 'Credit Card', billingAddress: 'Kathmandu, Nepal',
  },
  {
    id: '2', invoiceNumber: 'INV-2024-002', orderId: 'ORD-12346',
    customerName: 'Jane Smith', customerEmail: 'jane@example.com',
    date: '2024-01-16', dueDate: '2024-01-31',
    items: [{ id: '1', productName: 'MacBook Air M2', quantity: 1, unitPrice: 125000, total: 125000 }],
    subtotal: 125000, tax: 15000, total: 140000, status: 'pending',
    paymentMethod: 'Bank Transfer', billingAddress: 'Lalitpur, Nepal',
  },
  {
    id: '3', invoiceNumber: 'INV-2024-003', orderId: 'ORD-12347',
    customerName: 'Mike Johnson', customerEmail: 'mike@example.com',
    date: '2024-01-10', dueDate: '2024-01-25',
    items: [{ id: '1', productName: 'iPad Pro 12.9', quantity: 1, unitPrice: 85000, total: 85000 },
            { id: '2', productName: 'Apple Pencil', quantity: 1, unitPrice: 7500, total: 7500 }],
    subtotal: 92500, tax: 11100, total: 103600, status: 'overdue',
    paymentMethod: 'eSewa', billingAddress: 'Bhaktapur, Nepal',
  },
  {
    id: '4', invoiceNumber: 'INV-2024-004', orderId: 'ORD-12348',
    customerName: 'Sarah Williams', customerEmail: 'sarah@example.com',
    date: '2024-01-18', dueDate: '2024-02-02',
    items: [{ id: '1', productName: 'Apple Watch Ultra', quantity: 1, unitPrice: 65000, total: 65000 }],
    subtotal: 65000, tax: 7800, total: 72800, status: 'paid',
    paymentMethod: 'Credit Card', billingAddress: 'Kaski, Nepal',
  },
  {
    id: '5', invoiceNumber: 'INV-2024-005', orderId: 'ORD-12349',
    customerName: 'Robert Brown', customerEmail: 'robert@example.com',
    date: '2024-01-19', dueDate: '2024-02-03',
    items: [{ id: '1', productName: 'AirPods Max', quantity: 1, unitPrice: 45000, total: 45000 },
            { id: '2', productName: 'MagSafe Charger', quantity: 1, unitPrice: 3500, total: 3500 }],
    subtotal: 48500, tax: 5820, total: 54320, status: 'cancelled',
    paymentMethod: 'Cash on Delivery', billingAddress: 'Chitwan, Nepal',
  },
];

export function useInvoicesQueries() {
  const [invoices] = useState<Invoice[]>(mockInvoices);

  return { invoices };
}
