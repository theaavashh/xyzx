'use client';

import { X, Printer, Download } from 'lucide-react';
import type { Invoice } from '@/features/invoices';

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPrint: (invoice: Invoice) => void;
}

export default function InvoiceModal({
  invoice,
  isOpen,
  onClose,
  onPrint,
}: InvoiceModalProps) {
  if (!isOpen || !invoice) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Invoice Details
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Rapharch Store
              </h2>
              <p className="text-sm text-gray-500">Kathmandu, Nepal</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                {invoice.invoiceNumber}
              </div>
              <div
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(invoice.status)}`}
              >
                {invoice.status.charAt(0).toUpperCase() +
                  invoice.status.slice(1)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Bill To
              </h4>
              <p className="text-gray-900 font-medium">
                {invoice.customerName}
              </p>
              <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
              <p className="text-sm text-gray-500">{invoice.billingAddress}</p>
            </div>
            <div className="text-right">
              <div className="mb-1">
                <span className="text-sm text-gray-500">Order ID: </span>
                <span className="text-gray-900">{invoice.orderId}</span>
              </div>
              <div className="mb-1">
                <span className="text-sm text-gray-500">Invoice Date: </span>
                <span className="text-gray-900">{invoice.date}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Due Date: </span>
                <span className="text-gray-900">{invoice.dueDate}</span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Payment: </span>
                <span className="text-gray-900">{invoice.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Item
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Qty
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      NPR {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      NPR {item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm text-gray-900">
                  NPR {invoice.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Tax</span>
                <span className="text-sm text-gray-900">
                  NPR {invoice.tax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">
                  NPR {invoice.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => onPrint(invoice)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            type="button"
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
