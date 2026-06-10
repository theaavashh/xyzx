import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { healthCheck } from '../controllers/health.controller';
import analyticsRoutes from './analytics.routes';
import authRoutes from './auth.routes';
import bannerRoutes from './banner.routes';
import cartRoutes from './cart.routes';
import categoryRoutes from './category.routes';
import contentRoutes from './content.routes';
import dualCardSectionRoutes from './dual-card-section.routes';
import editorialSectionRoutes from './editorial-section.routes';
import featuredSectionRoutes from './featured-section.routes';
import salesBannerRoutes from './sales-banner.routes';
import followSectionRoutes from './follow-section.routes';
import footerCatalogRoutes from './footer-catalog.routes';
import footerSectionRoutes from './footer-section.routes';
import heroBannerRoutes from './hero-banner.routes';
import inventoryRoutes from './inventory.routes';
import jsonLdRoutes from './json-ld.routes';
import navigationRoutes from './navigation.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import productRoutes from './product.routes';
import rewardRoutes from './reward.routes';
import seoRoutes from './seo.routes';
import settingsRoutes from './settings.routes';
import shopByCategoryRoutes from './shop-by-category.routes';
import staffRoutes from './staff.routes';
import uploadRoutes from './upload.routes';
import userRoutes from './user.routes';
import userRewardRoutes from './userReward.routes';
import colorThemeRoutes from './color-theme.routes';
import deliveryRoutes from './delivery.routes';
import notificationRoutes from './notification.routes';
import posRoutes from './pos.routes';
import addressRoutes from './address.routes';
import publicUserRoutes from './public-user.routes';
import couponRoutes from './coupon.routes';
import faqRoutes from './faq.routes';
import shippingRoutes from './shipping.routes';
import storeRoutes from './store.routes';
import contactRoutes from './contact.routes';
import attributeOptionRoutes from './attribute-option.routes';

const router: Router = Router();

router.get('/health', healthCheck);

// Public routes (no auth required)
router.use('/auth', authRoutes);
router.use('/users', publicUserRoutes);
router.use('/content', contentRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/user-rewards', userRewardRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/faqs', faqRoutes);
router.use('/contact', contactRoutes);
router.use('/attribute-options', attributeOptionRoutes);

// Public read-only routes for storefront
router.use('/public/banners', bannerRoutes);
router.use('/public/hero-banners', heroBannerRoutes);
router.use('/shipping', shippingRoutes);
router.use('/store-section', storeRoutes);
router.use('/public/featured-sections', featuredSectionRoutes);
router.use('/public/shop-by-categories', shopByCategoryRoutes);
router.use('/public/navigation', navigationRoutes);
router.use('/public/footer-catalog', footerCatalogRoutes);
router.use('/public/footer-section', footerSectionRoutes);
router.use('/public/follow-section', followSectionRoutes);
router.use('/public/editorial-sections', editorialSectionRoutes);
router.use('/public/sales-banners', salesBannerRoutes);
router.use('/public/dual-card-sections', dualCardSectionRoutes);

// Protected routes (require authentication)
const authMiddleware = [authenticateToken];
const adminMiddleware = [authenticateToken, requireAdmin];

router.use('/staff', ...adminMiddleware, staffRoutes);
router.use('/upload', ...adminMiddleware, uploadRoutes);
router.use('/analytics', ...authMiddleware, analyticsRoutes);
router.use('/rewards', ...adminMiddleware, rewardRoutes);
router.use('/payments', paymentRoutes);
router.use('/json-ld', jsonLdRoutes);
router.use('/notifications', ...authMiddleware, notificationRoutes);
router.use('/deliveries', ...authMiddleware, deliveryRoutes);
router.use('/user/addresses', addressRoutes);

// Admin-managed routes (require admin auth)
router.use('/inventory', ...adminMiddleware, inventoryRoutes);
router.use('/banners', ...adminMiddleware, bannerRoutes);
router.use('/hero-banners', ...adminMiddleware, heroBannerRoutes);
router.use('/shop-by-categories', ...adminMiddleware, shopByCategoryRoutes);
router.use('/navigation', ...adminMiddleware, navigationRoutes);
router.use('/footer-catalog', ...adminMiddleware, footerCatalogRoutes);
router.use('/footer-section', ...adminMiddleware, footerSectionRoutes);
router.use('/follow-section', ...adminMiddleware, followSectionRoutes);
router.use('/featured-sections', ...adminMiddleware, featuredSectionRoutes);
router.use('/sales-banners', ...adminMiddleware, salesBannerRoutes);
router.use('/editorial-sections', ...adminMiddleware, editorialSectionRoutes);
router.use('/dual-card-sections', ...adminMiddleware, dualCardSectionRoutes);
router.use('/users', ...authMiddleware, userRoutes);
router.use('/color-theme', ...adminMiddleware, colorThemeRoutes);
router.use('/settings', ...authMiddleware, settingsRoutes);
router.use('/seo', ...authMiddleware, seoRoutes);
router.use('/pos', ...adminMiddleware, posRoutes);
router.use('/coupons', ...adminMiddleware, couponRoutes);

export default router;
