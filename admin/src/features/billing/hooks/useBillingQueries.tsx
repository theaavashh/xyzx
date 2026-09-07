'use client';

import { AlertTriangle, CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '@/utils/api';
import { formatCurrency } from '@/utils/currency';
import { useNewOrderSocket } from '@/hooks/useNewOrderSocket';
import type { Order, OrderStats, OrderPagination } from '../types';

const defaultPagination: OrderPagination = { page: 1, limit: 10, total: 0, totalPages: 0 };

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

const paymentStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
  PARTIALLY_REFUNDED: 'bg-orange-100 text-orange-800',
};

const statusIcons: Record<string, React.ReactElement> = {
  PENDING: <Clock className="w-4 h-4" />,
  CONFIRMED: <CheckCircle className="w-4 h-4" />,
  PROCESSING: <Package className="w-4 h-4" />,
  SHIPPED: <Truck className="w-4 h-4" />,
  DELIVERED: <CheckCircle className="w-4 h-4" />,
  CANCELLED: <XCircle className="w-4 h-4" />,
  REFUNDED: <AlertTriangle className="w-4 h-4" />,
};

function getStatusColor(status: string): string {
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

function getPaymentStatusColor(status: string): string {
  return paymentStatusColors[status] || 'bg-gray-100 text-gray-800';
}

function getStatusIcon(status: string): React.ReactElement {
  return statusIcons[status] || <Clock className="w-4 h-4" />;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function computeStats(orders: Order[], total: number): OrderStats {
  const byStatus = { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, refunded: 0 };
  let totalRevenue = 0;

  for (const o of orders) {
    const key = o.status.toLowerCase() as keyof typeof byStatus;
    if (key in byStatus) byStatus[key]++;
    if (o.paymentStatus === 'PAID') totalRevenue += o.total;
  }

  return {
    totalOrders: total,
    totalRevenue,
    averageOrderValue: total > 0 ? totalRevenue / total : 0,
    byStatus,
  };
}

export function useBillingQueries() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    byStatus: { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0, refunded: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [committedSearch, setCommittedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pagination, setPagination] = useState<OrderPagination>(defaultPagination);
  const [refreshKey, setRefreshKey] = useState(0);

  const paginationRef = useRef(defaultPagination);
  paginationRef.current = pagination || defaultPagination;
  const statusRef = useRef(statusFilter);
  statusRef.current = statusFilter;
  const paymentRef = useRef(paymentStatusFilter);
  paymentRef.current = paymentStatusFilter;
  const searchRef = useRef(committedSearch);
  searchRef.current = committedSearch;

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCommittedSearch(searchTerm);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setRefreshKey((k) => k + 1);
  }, [searchTerm]);

  const viewOrderDetails = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  }, []);

  const closeOrderModal = useCallback(() => {
    setShowOrderModal(false);
  }, []);

  const loadOrders = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const triggerRefresh = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setRefreshKey((k) => k + 1);
  }, []);

  useNewOrderSocket(
    useCallback((order) => {
      toast.success(`New order ${order.orderNumber} received`);
      setStatusFilter('all');
      setPaymentStatusFilter('all');
      setCommittedSearch('');
      setSearchTerm('');
      setPagination((prev) => ({ ...prev, page: 1 }));
      setRefreshKey((k) => k + 1);
    }, []),
  );

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const pg = paginationRef.current;
        const params: Record<string, unknown> = {
          page: pg.page,
          limit: pg.limit,
        };
        if (statusRef.current !== 'all') params.status = statusRef.current;
        if (searchRef.current) params.search = searchRef.current;

        const response = await apiRequest<{
          success: boolean;
          data: Order[];
          pagination: { page: number; limit: number; total: number; pages: number };
        }>('/api/v1/orders', 'GET', undefined, { params });

        if (mounted) {
          const orderList = response?.data ?? [];
          const pag = response?.pagination;
          const paginationData: OrderPagination = {
            page: pag?.page ?? pg.page,
            limit: pag?.limit ?? pg.limit,
            total: pag?.total ?? 0,
            totalPages: pag?.pages ?? 0,
          };
          setOrders(orderList);
          setStats(computeStats(orderList, paginationData.total));
          setPagination(paginationData);
        }
      } catch {
        if (mounted) toast.error('Failed to load orders');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setRefreshKey((k) => k + 1);
  }, [statusFilter, paymentStatusFilter]);

  return {
    orders,
    stats,
    isLoading,
    pagination: pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
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
  };
}
