'use client';

import { Printer, Search, Download, Eye, Filter } from 'lucide-react';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import InvoiceModal from '@/components/invoice/InvoiceModal';
import { useInvoicesQueries } from '@/features/invoices';
import type { Invoice } from '@/features/invoices';

function InvoicesContent() {
  const { invoices } = useInvoicesQueries();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = (invoice: Invoice) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .invoice-info { text-align: right; }
            .bill-to { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f5f5; }
            .totals { text-align: right; margin-top: 20px; }
            .total-row { display: flex; justify-content: flex-end; padding: 5px 0; }
            .total-label { width: 150px; }
            .total-value { width: 100px; }
            .grand-total { font-weight: bold; font-size: 18px; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Rapharch Store</div>
            <div class="invoice-info">
              <div><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</div>
              <div><strong>Date:</strong> ${invoice.date}</div>
              <div><strong>Due Date:</strong> ${invoice.dueDate}</div>
            </div>
          </div>
          <div class="bill-to">
            <strong>Bill To:</strong><br>
            ${invoice.customerName}<br>
            ${invoice.customerEmail}<br>
            ${invoice.billingAddress}
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>NPR ${item.unitPrice.toLocaleString()}</td>
                  <td>NPR ${item.total.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div class="total-row"><span class="total-label">Subtotal:</span><span class="total-value">NPR ${invoice.subtotal.toLocaleString()}</span></div>
            <div class="total-row"><span class="total-label">Tax:</span><span class="total-value">NPR ${invoice.tax.toLocaleString()}</span></div>
            <div class="total-row grand-total"><span class="total-label">Total:</span><span class="total-value">NPR ${invoice.total.toLocaleString()}</span></div>
          </div>
          <div style="margin-top: 40px; text-align: center;">
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black lastik">Invoices</h1>
          <p className="text-black text-lg mt-2">View and manage customer invoices</p>
        </div>
        <button type="button" className="bg-[#D4AF37] text-white px-4 py-2.5 lastik text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold">
          <Download className="w-4 h-4" /> Export All
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search by invoice number, customer name, or order ID..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-4 h-4" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{invoice.orderId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>{invoice.customerName}</div>
                    <div className="text-xs text-gray-500">{invoice.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{invoice.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">NPR {invoice.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setSelectedInvoice(invoice)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handlePrint(invoice)}
                        className="p-1 text-gray-500 hover:text-green-600 transition-colors" title="Print Invoice">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 text-gray-500 hover:text-blue-600 transition-colors" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12"><p className="text-gray-500">No invoices found</p></div>
      )}

      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPrint={handlePrint}
      />
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <InvoicesContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
