import { Router } from 'express';
import {
  getSalesOverview,
  getOrdersChart,
  getTrafficOverview,
  getRecentOrders,
  getTopProducts,
  getRecentActivity,
  getOrdersByStatus,
  getRevenueMetrics,
  getCategoryPerformance,
} from '../controllers/analytics.controller';

const router: Router = Router();

router.get('/sales-overview', getSalesOverview);
router.get('/traffic-overview', getTrafficOverview);
router.get('/orders-chart', getOrdersChart);
router.get('/recent-orders', getRecentOrders);
router.get('/top-products', getTopProducts);
router.get('/recent-activity', getRecentActivity);
router.get('/orders-by-status', getOrdersByStatus);
router.get('/revenue-metrics', getRevenueMetrics);
router.get('/category-performance', getCategoryPerformance);

export default router;
