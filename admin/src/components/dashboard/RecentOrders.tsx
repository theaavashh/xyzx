'use client';

import { clientLogger } from '@/lib/logger';
import {
  Calendar,
  Eye,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  User,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  items: number;
  createdAt: Date;
}

interface RecentOrdersProps {
  limit?: number;
  showRefresh?: boolean;
  onViewOrder?: (orderId: string) => void;
}

import type { ApiResponse } from '@/types';

interface RecentOrderApiResponse {
  data: RecentOrder[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({
  limit = 5,
  showRefresh = true,
  onViewOrder,
}) => {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentOrders = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/analytics/recent-orders?limit=${limit}`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const result: ApiResponse<RecentOrder[]> = await response.json();
        const ordersData = result.data || result;

        const formattedOrders = ordersData.map((order) => ({
          ...order,
          createdAt: new Date(order.createdAt),
        }));

        setOrders(formattedOrders);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch orders',
        );
      } finally {
        if (showLoading) setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecentOrders();
  }, [fetchRecentOrders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRecentOrders(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'confirmed':
        return <CheckCircle className="w-3 h-3" />;
      case 'processing':
        return <Package className="w-3 h-3" />;
      case 'shipped':
        return <Truck className="w-3 h-3" />;
      case 'delivered':
        return <CheckCircle className="w-3 h-3" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 lastik uppercase">
                Recent Orders
              </h3>
              <p className="text-xs text-gray-500 custom-font">
                Latest customer orders
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 lastik uppercase tracking-wide">
              Recent Orders
            </h3>
            <p className="text-xs text-gray-500 custom-font">
              Latest customer orders
            </p>
          </div>
        </div>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh orders"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        )}
      </div>

      {error ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-red-600 custom-font mb-2">{error}</p>
          <button
            onClick={() => fetchRecentOrders()}
            className="text-sm text-purple-600 hover:text-purple-700 custom-font"
          >
            Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 custom-font mb-2">No recent orders</p>
          <p className="text-xs text-gray-400 custom-font">
            Orders will appear here once customers start shopping
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="group border border-gray-100 rounded-lg p-4 hover:shadow-md hover:border-purple-200 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900 custom-font truncate">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 custom-font mb-1">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      <span>
                        {order.items} item{order.items !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 custom-font flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="text-sm font-bold text-gray-900 custom-font">
                    {formatCurrency(order.total)}
                  </div>
                  {onViewOrder && (
                    <button
                      onClick={() => onViewOrder(order.id)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-purple-600 hover:text-purple-700 custom-font flex items-center gap-1 transition-opacity"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Additional icons for status
import { CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

export default RecentOrders;
