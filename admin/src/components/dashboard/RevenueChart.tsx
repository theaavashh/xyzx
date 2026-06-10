'use client';

import { useState } from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from '@/components/dashboard/ChartCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { useRevenueMetrics } from '@/hooks/useDashboardData';

const PERIOD_OPTIONS = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
];

function RevenueChart() {
  const [period, setPeriod] = useState('7d');
  const [isOpen, setIsOpen] = useState(false);

  const { data: revenueMetrics, isLoading: isRevenueLoading, error } =
    useRevenueMetrics(period);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `NPR ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `NPR ${(amount / 1000).toFixed(1)}K`;
    return `NPR ${amount.toLocaleString()}`;
  };

  const selectedLabel = PERIOD_OPTIONS.find((o) => o.value === period)?.label;

  if (isRevenueLoading) {
    return <div className="animate-pulse h-96" />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <p className="text-red-600 font-semibold">Failed to load revenue data</p>
        <p className="text-red-500 text-sm mt-1">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <ChartCard
      title="Revenue Trend"
      icon={DollarSign}
      iconColor="text-green-600"
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
        {Array.isArray(revenueMetrics?.dailyRevenue) &&
        revenueMetrics.dailyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueMetrics.dailyRevenue}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
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
                formatter={(value) =>
                  value !== undefined ? formatCurrency(value as number) : ''
                }
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ fontWeight: '600', color: '#111827' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="No revenue data available" />
        )}
      </div>
    </ChartCard>
  );
}

export default RevenueChart;
