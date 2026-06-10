'use client';

import { BarChart3, PieChart, Package } from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from '@/components/dashboard/ChartCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { useTrafficOverview, useTopProducts, useOrdersByStatus } from '@/hooks/useDashboardData';

import type { TrafficSource, OrderStatusCount } from '@/types';

const COLORS = ['#D4AF37', '#c9a32e', '#b8960f', '#a8872b', '#8B6914'];

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ffc658',
  PROCESSING: '#0088fe',
  SHIPPED: '#8884d8',
  DELIVERED: '#82ca9d',
  CANCELLED: '#ff8042',
  REFUNDED: '#ff6b6b',
};

function TrafficAndProducts() {
  const { data: trafficData, isLoading: isTrafficLoading, error: trafficError } =
    useTrafficOverview();
  const { data: topProducts, isLoading: isProductsLoading, error: productsError } = useTopProducts();
  const { data: ordersByStatus, isLoading: isOrdersStatusLoading, error: ordersStatusError } = useOrdersByStatus();

  const isLoading = isTrafficLoading || isProductsLoading || isOrdersStatusLoading;
  const error = trafficError || productsError || ordersStatusError;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="animate-pulse h-96" />
        <div className="animate-pulse h-96" />
        <div className="animate-pulse h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <p className="text-red-600 font-semibold">Failed to load chart data</p>
        <p className="text-red-500 text-sm mt-1">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ChartCard
        title="Traffic Sources"
        icon={PieChart}
        iconColor="text-blue-600"
      >
        <div className="h-80">
          {Array.isArray(trafficData?.trafficSources) &&
          trafficData.trafficSources.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={trafficData.trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent ?? 0).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="visitors"
                >
                  {trafficData.trafficSources.map((entry) => (
                    <Cell
                      key={`cell-${entry.source}`}
                      fill={
                        COLORS[
                          trafficData.trafficSources.indexOf(entry) %
                            COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ fontWeight: '600', color: '#111827' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No traffic data available" />
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Orders by Status"
        icon={BarChart3}
        iconColor="text-green-600"
      >
        <div className="h-80">
          {Array.isArray(ordersByStatus) && ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={ordersByStatus}
                layout="vertical"
                margin={{ left: 10 }}
              >
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ fontWeight: '600', color: '#111827' }}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                >
                  {ordersByStatus.map((entry: OrderStatusCount, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No order status data available" />
          )}
        </div>
      </ChartCard>

      <ChartCard title="Top Products" icon={Package}>
        <div className="h-80">
          {Array.isArray(topProducts) && topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={topProducts}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ fontWeight: '600', color: '#111827' }}
                />
                <Bar
                  dataKey="sold"
                  fill="#D4AF37"
                  radius={[0, 4, 4, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No product data available" />
          )}
        </div>
      </ChartCard>
    </div>
  );
}

export default TrafficAndProducts;
