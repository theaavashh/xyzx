'use client';

import { useState } from 'react';
import { BarChart3, ChevronDown } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from '@/components/dashboard/ChartCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { useOrdersChart } from '@/hooks/useDashboardData';

const PERIOD_OPTIONS = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 14 days', value: '14d' },
  { label: 'Last 30 days', value: '30d' },
];

function SalesCharts() {
  const [period, setPeriod] = useState('14d');
  const [isOpen, setIsOpen] = useState(false);

  const { data: ordersChartData, isLoading: isOrdersChartLoading, error } =
    useOrdersChart(period);

  const selectedLabel = PERIOD_OPTIONS.find((o) => o.value === period)?.label;

  if (isOrdersChartLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard
        title="Sales Trend"
        icon={BarChart3}
        subtitle={selectedLabel}
        filterDropdown={
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setIsOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              {selectedLabel}
              <ChevronDown className="w-3 h-3" />
            </button>
            {isOpen && (
              <div
                className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[140px]"
                onMouseLeave={() => setIsOpen(false)}
              >
                {PERIOD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setPeriod(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      period === option.value
                        ? 'font-semibold text-gray-900 bg-gray-50'
                        : 'text-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      >
        <div className="h-80">
          {Array.isArray(ordersChartData) && ordersChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersChartData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dx={-10}
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
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No sales data available" />
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Orders by Date"
        icon={BarChart3}
        iconColor="text-green-600"
      >
        <div className="h-80">
          {Array.isArray(ordersChartData) && ordersChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={ordersChartData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dx={-10}
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
                  dataKey="orders"
                  fill="#D4AF37"
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No orders data available" />
          )}
        </div>
      </ChartCard>
    </div>
  );
}

export default SalesCharts;
