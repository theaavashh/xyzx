'use client';

import { useState } from 'react';
import { Filter, RefreshCw, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useBillingQueries,
  OrderDetailsModal,
  OrderPaginationComponent,
  OrderStatsComponent,
  OrderTable,
} from '@/features/billing';

const statusOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];

const paymentStatusOptions = [
  { value: 'all', label: 'All Payment Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'PARTIALLY_REFUNDED', label: 'Partially Refunded' },
];

export default function OrdersPage() {
  const [showFilters, setShowFilters] = useState(false);

  const {
    orders,
    stats,
    isLoading,
    pagination,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    selectedOrder,
    showOrderModal,
    setPagination,
    handleSearch,
    viewOrderDetails,
    closeOrderModal,
    loadOrders,
    getStatusColor,
    getPaymentStatusColor,
    getStatusIcon,
    formatCurrency,
    formatDate,
  } = useBillingQueries();

  const activeFilters = (statusFilter !== 'all' ? 1 : 0) + (paymentStatusFilter !== 'all' ? 1 : 0);

  return (
    <DashboardLayout title="Orders">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Order Management
            </h1>
            <p className="text-black text-lg mt-2">
              View and manage all customer orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e as any)}
                className="w-48 sm:w-56 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-black placeholder:text-gray-400 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilters > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={loadOrders}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <OrderStatsComponent stats={stats} formatCurrency={formatCurrency} />

        <OrderTable
          orders={orders}
          viewOrderDetails={viewOrderDetails}
          getStatusColor={getStatusColor}
          getPaymentStatusColor={getPaymentStatusColor}
          getStatusIcon={getStatusIcon}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />

        <OrderPaginationComponent pagination={pagination} setPagination={setPagination} />

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-black">Filter Orders</h2>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-5 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Order Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Payment Status</label>
                    <select
                      value={paymentStatusFilter}
                      onChange={(e) => setPaymentStatusFilter(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                    >
                      {paymentStatusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="w-full py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] font-semibold transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <OrderDetailsModal
          show={showOrderModal}
          order={selectedOrder}
          onClose={closeOrderModal}
          getStatusColor={getStatusColor}
          getPaymentStatusColor={getPaymentStatusColor}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </div>
    </DashboardLayout>
  );
}
