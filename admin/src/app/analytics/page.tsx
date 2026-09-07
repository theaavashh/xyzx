'use client';


import { clientLogger } from '@/lib/logger';

import { motion } from 'framer-motion';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  Eye,
  Facebook,
  Globe,
  type LucideIcon,
  MousePointer,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { getApiBaseUrl } from '@/utils/api';
import { authHeaders } from '@/utils/authHeaders';

type AnalyticsView =
  | 'quick-insights'
  | 'sales-analytics'
  | 'website-analytics'
  | 'shipping-analytics'
  | 'google-analytics'
  | 'facebook-pixel';

const analyticsOptions = [
  { value: 'quick-insights', label: 'Quick Insights', icon: TrendingUp },
  { value: 'sales-analytics', label: 'Sales Analytics', icon: BarChart3 },
  { value: 'website-analytics', label: 'Website Analytics', icon: BarChart },
  { value: 'shipping-analytics', label: 'Shipping Analytics', icon: Truck },
  { value: 'google-analytics', label: 'Google Analytics', icon: Globe },
  { value: 'facebook-pixel', label: 'Facebook Pixel', icon: Facebook },
];

const dateRangeOptions = [
  { value: '7d', label: 'Last 7 days', icon: Clock },
  { value: '30d', label: 'Last 30 days', icon: Calendar },
  { value: '90d', label: 'Last 90 days', icon: Calendar },
  { value: '1y', label: 'Last year', icon: BarChart3 },
];

interface MetricCardProps {
  title: string;
  value: string | number;
  growth: number;
  icon: LucideIcon;
  color: string;
}

const MetricCard = ({
  title,
  value,
  growth,
  icon: Icon,
  color,
}: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg border border-gray-200 p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <div className="flex items-center mt-2">
          {growth >= 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`text-sm font-medium ml-1 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {growth > 0 ? '+' : ''}
            {growth.toFixed(1)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs last period</span>
        </div>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

interface QuickInsightsData {
  todaySales: number;
  todayOrders: number;
  todayVisitors: number;
  todayRevenue: number;
  salesGrowth: number;
  ordersGrowth: number;
  visitorsGrowth: number;
  revenueGrowth: number;
  chartData: Array<{
    name: string;
    sales: number;
    orders: number;
    visitors: number;
  }>;
}

interface SalesAnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  conversionRate: number;
  chartData: Array<{ date: string; revenue: number; orders: number }>;
}

interface TrafficData {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  avgSessionDuration: string;
  bounceRate: number;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
}

export default function AnalyticsPage() {
  const [selectedView, setSelectedView] =
    useState<AnalyticsView>('quick-insights');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  const [quickInsights, setQuickInsights] = useState<QuickInsightsData | null>(
    null,
  );
  const [salesAnalytics, setSalesAnalytics] =
    useState<SalesAnalyticsData | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);

  const API_BASE_URL = getApiBaseUrl();

  const fetchQuickInsights = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/analytics/sales-overview?period=${dateRange}`,
        {
          credentials: 'include',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const data = result.data;
          const todayRevenue =
            data.dailyRevenue?.[data.dailyRevenue.length - 1]?.revenue || 0;
          const todayOrders =
            data.dailyRevenue?.[data.dailyRevenue.length - 1]?.orders || 0;

          setQuickInsights({
            todaySales: todayRevenue,
            todayOrders: todayOrders,
            todayVisitors: 0,
            todayRevenue: todayRevenue,
            salesGrowth: data.revenueGrowth || 0,
            ordersGrowth: data.ordersGrowth || 0,
            visitorsGrowth: 0,
            revenueGrowth: data.revenueGrowth || 0,
            chartData: (data.dailyRevenue || []).map((d: { date: string; revenue: number; orders: number }) => ({
              name: new Date(d.date).toLocaleDateString('en-US', {
                weekday: 'short',
              }),
              sales: d.revenue,
              orders: d.orders,
              visitors: 0,
            })),
          });
        }
      }
    } catch (error) {
      clientLogger.error('Error fetching quick insights:', error);
    }
  }, [API_BASE_URL, dateRange]);

  const fetchSalesAnalytics = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/analytics/revenue-metrics?period=${dateRange}`,
        {
          credentials: 'include',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const data = result.data;
          setSalesAnalytics({
            totalRevenue: data.totalRevenue || 0,
            totalOrders: data.totalOrders || 0,
            totalCustomers: 0,
            avgOrderValue: data.avgOrderValue || 0,
            revenueGrowth: data.revenueGrowth || 0,
            ordersGrowth: 0,
            conversionRate: 0,
            chartData: (data.dailyRevenue || []).map((d: { date: string; revenue: number; orders: number }) => ({
              date: d.date,
              revenue: d.revenue,
              orders: d.orders,
            })),
          });
        }
      }

      const chartResponse = await fetch(
        `${API_BASE_URL}/api/v1/analytics/orders-chart?period=${dateRange}`,
        {
          credentials: 'include',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
        },
      );

      if (chartResponse.ok) {
        const chartResult = await chartResponse.json();
        if (chartResult.success) {
          setSalesAnalytics((prev) => ({
            ...prev!,
            chartData: chartResult.data.map((d: { date: string; revenue: number; orders: number }) => ({
              date: d.date,
              revenue: d.revenue,
              orders: d.orders,
            })),
          }));
        }
      }
    } catch (error) {
      clientLogger.error('Error fetching sales analytics:', error);
    }
  }, [API_BASE_URL, dateRange]);

  const fetchTrafficData = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/analytics/traffic-overview`,
        {
          credentials: 'include',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTrafficData(result.data);
        }
      }
    } catch (error) {
      clientLogger.error('Error fetching traffic data:', error);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const fetchData = async () => {
      await Promise.all([
        fetchQuickInsights(),
        fetchSalesAnalytics(),
        fetchTrafficData(),
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, [fetchQuickInsights, fetchSalesAnalytics, fetchTrafficData]);

  const formatCurrency = (value: number) => `NPR ${value.toLocaleString()}`;

  const selectedOption = analyticsOptions.find(
    (opt) => opt.value === selectedView,
  );

  const QuickInsightsView = () => {
    if (!quickInsights && isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
        </div>
      );
    }

    const data = quickInsights || {
      todaySales: 0,
      todayOrders: 0,
      todayVisitors: 0,
      todayRevenue: 0,
      salesGrowth: 0,
      ordersGrowth: 0,
      visitorsGrowth: 0,
      revenueGrowth: 0,
      chartData: [],
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Today's Sales"
            value={formatCurrency(data.todaySales)}
            growth={data.salesGrowth}
            icon={DollarSign}
            color="bg-green-100 text-green-600"
          />
          <MetricCard
            title="Today's Orders"
            value={data.todayOrders.toString()}
            growth={data.ordersGrowth}
            icon={ShoppingCart}
            color="bg-blue-100 text-blue-600"
          />
          <MetricCard
            title="Today's Visitors"
            value={data.todayVisitors.toLocaleString()}
            growth={data.visitorsGrowth}
            icon={Users}
            color="bg-purple-100 text-purple-600"
          />
          <MetricCard
            title="Today's Revenue"
            value={formatCurrency(data.todayRevenue)}
            growth={data.revenueGrowth}
            icon={TrendingUp}
            color="bg-[#D4AF37]/10 text-[#D4AF37]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sales & Orders Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="sales"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="orders"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Line
                  yAxisId="sales"
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const SalesAnalyticsView = () => {
    if (!salesAnalytics && isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
        </div>
      );
    }

    const data = salesAnalytics || {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      avgOrderValue: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      conversionRate: 0,
      chartData: [],
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.totalRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium ml-1 text-green-600">
                    +{data.revenueGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.totalOrders.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium ml-1 text-green-600">
                    +{data.ordersGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.totalCustomers.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium ml-1 text-green-600">
                    +0%
                  </span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Order Value
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.avgOrderValue)}
                </p>
                <div className="flex items-center mt-1">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium ml-1 text-gray-600">
                    {(data.conversionRate || 0).toFixed(1)}% conversion
                  </span>
                </div>
              </div>
              <div className="bg-[#D4AF37]/10 p-3 rounded-full">
                <Package className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const WebsiteAnalyticsView = () => {
    const deviceData = trafficData
      ? [
          {
            name: 'Desktop',
            value: trafficData.deviceBreakdown.desktop,
            color: '#3b82f6',
          },
          {
            name: 'Mobile',
            value: trafficData.deviceBreakdown.mobile,
            color: '#10b981',
          },
          {
            name: 'Tablet',
            value: trafficData.deviceBreakdown.tablet,
            color: '#f59e0b',
          },
        ]
      : [
          { name: 'Desktop', value: 45, color: '#3b82f6' },
          { name: 'Mobile', value: 40, color: '#10b981' },
          { name: 'Tablet', value: 15, color: '#f59e0b' },
        ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Users',
              value: trafficData?.totalVisitors || 0,
              change: '+12.5%',
              icon: Users,
            },
            {
              title: 'Sessions',
              value: trafficData?.pageViews || 0,
              change: '+8.3%',
              icon: BarChart3,
            },
            {
              title: 'Page Views',
              value: trafficData?.pageViews || 0,
              change: '+15.2%',
              icon: Eye,
            },
            {
              title: 'Bounce Rate',
              value: `${trafficData?.bounceRate || 0}%`,
              change: '-2.1%',
              icon: MousePointer,
            },
          ].map((stat, idx) => (
            <motion.div
              key={`website-${stat.title}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {typeof stat.value === 'number'
                  ? stat.value.toLocaleString()
                  : stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Traffic Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trafficData?.trafficSources || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Device Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const ShippingAnalyticsView = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Shipments
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+0%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  On-Time Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">0%</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+0%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Delivery
                </p>
                <p className="text-2xl font-bold text-gray-900">0 days</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>-0 days</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Shipping Profit
                </p>
                <p className="text-2xl font-bold text-gray-900">NPR 0</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+0%</span>
                </div>
              </div>
              <div className="p-3 bg-[#D4AF37]/10 rounded-full">
                <BarChart3 className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Shipment Status
          </h3>
          <p className="text-gray-500 text-sm">
            Connect your shipping provider to see real data.
          </p>
        </div>
      </div>
    );
  };

  const GoogleAnalyticsView = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Users',
              value: trafficData?.totalVisitors || 0,
              change: '+12.5%',
              icon: Users,
            },
            {
              title: 'Sessions',
              value: trafficData?.pageViews || 0,
              change: '+8.3%',
              icon: BarChart3,
            },
            {
              title: 'Page Views',
              value: trafficData?.pageViews || 0,
              change: '+15.2%',
              icon: Eye,
            },
            {
              title: 'Conversion Rate',
              value: '0%',
              change: '+0%',
              icon: TrendingUp,
            },
          ].map((stat, idx) => (
            <motion.div
              key={`ga-${stat.title}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {typeof stat.value === 'number'
                  ? stat.value.toLocaleString()
                  : stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">
            Connect Google Analytics
          </h3>
          <p className="text-[#D4AF37] mb-4">
            To see real Google Analytics data, connect your GA4 property in the
            settings.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8962e] transition-colors"
          >
            Connect GA4
          </button>
        </div>
      </div>
    );
  };

  const FacebookPixelView = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Page Views',
              value: trafficData?.pageViews || 0,
              change: '+18.5%',
              icon: Eye,
            },
            {
              title: 'Add to Cart',
              value: 0,
              change: '+12.3%',
              icon: ShoppingCart,
            },
            {
              title: 'Purchases',
              value: salesAnalytics?.totalOrders || 0,
              change: '+8.7%',
              icon: DollarSign,
            },
            { title: 'ROAS', value: '0x', change: '+0x', icon: TrendingUp },
          ].map((stat, idx) => (
            <motion.div
              key={`fb-${stat.title}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {typeof stat.value === 'number'
                  ? stat.value.toLocaleString()
                  : stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">
            Facebook Pixel Setup
          </h3>
          <p className="text-[#D4AF37] mb-4">
            To see real Facebook Pixel data, install your pixel ID in the
            settings.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8962e] transition-colors"
          >
            Setup Pixel
          </button>
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (selectedView) {
      case 'quick-insights':
        return <QuickInsightsView />;
      case 'sales-analytics':
        return <SalesAnalyticsView />;
      case 'website-analytics':
        return <WebsiteAnalyticsView />;
      case 'shipping-analytics':
        return <ShippingAnalyticsView />;
      case 'google-analytics':
        return <GoogleAnalyticsView />;
      case 'facebook-pixel':
        return <FacebookPixelView />;
      default:
        return <QuickInsightsView />;
    }
  };

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Analytics</h1>
            <p className="text-black text-lg mt-2">
              View and analyze your store performance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px]"
              >
                {selectedOption && (
                  <selectedOption.icon className="w-5 h-5 text-gray-600" />
                )}
                <span className="flex-1 text-left text-black">
                  {selectedOption?.label}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {analyticsOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSelectedView(option.value as AnalyticsView);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        selectedView === option.value
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                          : 'text-gray-700'
                      }`}
                    >
                      <option.icon
                        className={`w-5 h-5 ${selectedView === option.value ? 'text-[#D4AF37]' : 'text-gray-500'}`}
                      />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[140px]"
              >
                {dateRangeOptions.find((opt) => opt.value === dateRange)
                  ?.icon &&
                  (() => {
                    const Icon = dateRangeOptions.find(
                      (opt) => opt.value === dateRange,
                    )?.icon as React.ComponentType<{ className?: string }>;
                    return Icon ? <Icon className="w-5 h-5 text-gray-600" /> : null;
                  })()}
                <span className="flex-1 text-left text-black">
                  {
                    dateRangeOptions.find((opt) => opt.value === dateRange)
                      ?.label
                  }
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${dateDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dateDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
                  {dateRangeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setDateRange(option.value);
                          setDateDropdownOpen(false);
                        }}
                        className={`group relative flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          dateRange === option.value
                            ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'text-gray-700'
                        }`}
                        title={option.label}
                      >
                        <Icon
                          className={`w-5 h-5 ${dateRange === option.value ? 'text-[#D4AF37]' : 'text-gray-500'}`}
                        />
                        <span>{option.label}</span>
                        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              className="flex items-center px-4 py-2 text-white bg-[#D4AF37] rounded-lg hover:bg-[#b8962e] transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
