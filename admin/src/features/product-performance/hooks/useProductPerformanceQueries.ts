import { useCallback, useState } from 'react';
import { clientLogger } from '@/lib/logger';
import type { ProductPerformance, CategoryPerformance, PerformanceMetrics } from '../types';

const mockProducts: ProductPerformance[] = [
  {
    id: '1', name: 'Traditional Handicraft Wooden Bowl Set', category: 'Handicrafts',
    sku: 'HC-WB-001', price: 2500, sales: 45, revenue: 112500, views: 1250,
    conversion: 3.6, rating: 4.8, reviews: 124, stock: 15, growth: 12.5,
    status: 'active', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop',
    lastUpdated: '2024-01-15',
  },
  {
    id: '2', name: 'Brass Puja Thali Set', category: 'Puja Samagri',
    sku: 'PS-TH-002', price: 1800, sales: 38, revenue: 68400, views: 980,
    conversion: 3.9, rating: 4.6, reviews: 89, stock: 8, growth: 8.3,
    status: 'active', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop',
    lastUpdated: '2024-01-14',
  },
  {
    id: '3', name: 'Nepali Musical Instruments Collection', category: 'Musical Instruments',
    sku: 'MI-NC-003', price: 3000, sales: 32, revenue: 96000, views: 1100,
    conversion: 2.9, rating: 4.9, reviews: 156, stock: 0, growth: 15.2,
    status: 'out-of-stock', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
    lastUpdated: '2024-01-13',
  },
  {
    id: '4', name: 'Handwoven Pashmina Shawl', category: 'Handicrafts',
    sku: 'HC-PS-004', price: 3000, sales: 28, revenue: 84000, views: 850,
    conversion: 3.3, rating: 4.7, reviews: 67, stock: 12, growth: 6.7,
    status: 'active', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=100&h=100&fit=crop',
    lastUpdated: '2024-01-12',
  },
  {
    id: '5', name: 'Rudrakshya Mala Set', category: 'Puja Samagri',
    sku: 'PS-RM-005', price: 1500, sales: 25, revenue: 37500, views: 720,
    conversion: 3.5, rating: 4.5, reviews: 43, stock: 20, growth: 9.1,
    status: 'active', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
    lastUpdated: '2024-01-11',
  },
  {
    id: '6', name: 'Traditional Nepali Tea Set', category: 'Foods',
    sku: 'FD-TS-006', price: 800, sales: 18, revenue: 14400, views: 450,
    conversion: 4.0, rating: 4.3, reviews: 28, stock: 5, growth: -2.1,
    status: 'active', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100&h=100&fit=crop',
    lastUpdated: '2024-01-10',
  },
];

const mockCategoryData: CategoryPerformance[] = [
  { category: 'Handicrafts', products: 2, revenue: 196500, growth: 9.6, avgRating: 4.75 },
  { category: 'Puja Samagri', products: 2, revenue: 105900, growth: 8.7, avgRating: 4.55 },
  { category: 'Musical Instruments', products: 1, revenue: 96000, growth: 15.2, avgRating: 4.9 },
  { category: 'Foods', products: 1, revenue: 14400, growth: -2.1, avgRating: 4.3 },
];

const mockMetrics: PerformanceMetrics = {
  totalProducts: 6, activeProducts: 5, totalRevenue: 412800,
  avgConversion: 3.5, avgRating: 4.6, totalViews: 5350,
  outOfStock: 1, topPerformer: 'Traditional Handicraft Wooden Bowl Set',
  worstPerformer: 'Traditional Nepali Tea Set',
};

export function useProductPerformanceQueries() {
  const [isLoading, setIsLoading] = useState(false);

  const loadProductData = useCallback(async (): Promise<{
    products: ProductPerformance[];
    categoryData: CategoryPerformance[];
    metrics: PerformanceMetrics;
  }> => {
    setIsLoading(true);
    try {
      return { products: mockProducts, categoryData: mockCategoryData, metrics: mockMetrics };
    } catch (error) {
      clientLogger.error('Error loading product data:', error);
      return { products: [], categoryData: [], metrics: mockMetrics };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, loadProductData };
}
