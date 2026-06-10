import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/utils/api';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  ordersByStatus: Record<string, number>;
}

export interface SalesOverviewData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  ordersByStatus: Record<string, number>;
  dailyRevenue: { date: string; revenue: number; orders: number }[];
  totalCustomers: number;
  conversionRate: number;
}

export interface OrdersChartData {
  date: string;
  orders: number;
  revenue: number;
}

export interface TrafficData {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  avgSessionDuration: string;
  bounceRate: number;
  trafficSources: { source: string; visitors: number; percentage: number }[];
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalSales: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  items: number;
  createdAt: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface CategoryPerformance {
  category: string;
  productCount: number;
  itemsSold: number;
  revenue: number;
  growth: number;
  turnover: string;
}

export function useSalesOverview(period = '7d') {
  return useQuery({
    queryKey: ['sales-overview', period],
    queryFn: () =>
      apiRequest<SalesOverviewData>(
        `/api/v1/analytics/sales-overview?period=${period}`,
      ),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}

export function useOrdersChart(period = '14d') {
  return useQuery({
    queryKey: ['orders-chart', period],
    queryFn: () =>
      apiRequest<OrdersChartData[]>(
        `/api/v1/analytics/orders-chart?period=${period}`,
      ),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}

export function useTrafficOverview() {
  return useQuery({
    queryKey: ['traffic-overview'],
    queryFn: () =>
      apiRequest<TrafficData>(`/api/v1/analytics/traffic-overview`),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: ['top-products', limit],
    queryFn: () =>
      apiRequest<TopProduct[]>(`/api/v1/analytics/top-products?limit=${limit}`),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ['recent-orders'],
    queryFn: () =>
      apiRequest<RecentOrder[]>(`/api/v1/analytics/recent-orders`),
    staleTime: 1000 * 60 * 2,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: () =>
      apiRequest<RecentActivity[]>(`/api/v1/analytics/recent-activity`),
    staleTime: 1000 * 60 * 2,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}

export function useRevenueMetrics(period = '30d') {
  return useQuery({
    queryKey: ['revenue-metrics', period],
    queryFn: () =>
      apiRequest<{
        totalRevenue: number;
        avgOrderValue: number;
        revenueGrowth: number;
        dailyRevenue: { date: string; revenue: number }[];
      }>(`/api/v1/analytics/revenue-metrics?period=${period}`),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}

export function useOrdersByStatus() {
  return useQuery({
    queryKey: ['orders-by-status'],
    queryFn: () =>
      apiRequest<{ name: string; count: number }[]>(
        `/api/v1/analytics/orders-by-status`,
      ),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}

export function useCategoryPerformance() {
  return useQuery({
    queryKey: ['category-performance'],
    queryFn: () =>
      apiRequest<CategoryPerformance[]>(
        `/api/v1/analytics/category-performance`,
      ),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}
