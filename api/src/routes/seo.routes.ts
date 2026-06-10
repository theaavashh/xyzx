import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import {
  getSitemap, updateSitemap, addSitemapUrl, deleteSitemapUrl, generateSitemap,
  getRobots, updateRobots,
} from '../controllers/seo.controller';

const router: Router = Router();

// Sitemap
router.get('/sitemap', getSitemap);
router.put('/sitemap', authenticateToken, updateSitemap);
router.post('/sitemap/urls', authenticateToken, addSitemapUrl);
router.delete('/sitemap/urls', authenticateToken, deleteSitemapUrl);
router.post('/sitemap/generate', authenticateToken, generateSitemap);

// Robots.txt
router.get('/robots', getRobots);
router.post('/robots', authenticateToken, updateRobots);

export default router;
