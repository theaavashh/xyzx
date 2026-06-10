import { Clock, CreditCard, DollarSign, ShoppingCart } from 'lucide-react';
import type { OrderStats } from '../types';

interface OrderStatsProps {
  stats: OrderStats;
  formatCurrency: (amount: number, currency?: string, symbol?: string) => string;
}

export default function OrderStats({ stats, formatCurrency }: OrderStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500">All time</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-sm text-gray-500">All orders</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Average Order Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.averageOrderValue)}
            </p>
            <p className="text-sm text-gray-500">Per order</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <CreditCard className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.byStatus.pending}</p>
            <p className="text-sm text-gray-500">Awaiting confirmation</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
