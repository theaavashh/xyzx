export interface ProductPerformance {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  sales: number;
  revenue: number;
  views: number;
  conversion: number;
  rating: number;
  reviews: number;
  stock: number;
  growth: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  image: string;
  lastUpdated: string;
}

export interface CategoryPerformance {
  category: string;
  products: number;
  revenue: number;
  growth: number;
  avgRating: number;
}

export interface PerformanceMetrics {
  totalProducts: number;
  activeProducts: number;
  totalRevenue: number;
  avgConversion: number;
  avgRating: number;
  totalViews: number;
  outOfStock: number;
  topPerformer: string;
  worstPerformer: string;
}
