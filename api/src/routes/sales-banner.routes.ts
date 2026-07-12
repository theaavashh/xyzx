import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { salesBannerCreateSchema, salesBannerUpdateSchema, salesBannerReorderSchema } from '../dto/sales-banner.dto';
import {
  getSalesBanners,
  getActiveSalesBanners,
  getSalesBannerById,
  createSalesBanner,
  updateSalesBanner,
  deleteSalesBanner,
  toggleSalesBannerStatus,
  reorderSalesBanners,
} from '../controllers/sales-banner.controller';

const router: Router = Router();

router.get('/active', getActiveSalesBanners);
router.get('/', authenticateToken, requireAdmin, getSalesBanners);
router.get('/:id', authenticateToken, requireAdmin, getSalesBannerById);
router.post('/', authenticateToken, requireAdmin, validate(salesBannerCreateSchema), createSalesBanner);
router.put('/:id', authenticateToken, requireAdmin, validate(salesBannerUpdateSchema), updateSalesBanner);
router.delete('/:id', authenticateToken, requireAdmin, deleteSalesBanner);
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleSalesBannerStatus);
router.patch('/reorder', authenticateToken, requireAdmin, validate(salesBannerReorderSchema), reorderSalesBanners);

export default router;
