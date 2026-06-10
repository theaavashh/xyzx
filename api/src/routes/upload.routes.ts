import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import {
  heroBannerUpload,
  shopByCategoryUpload,
  categoryUpload,
  featuredSectionUpload,
  salesBannerUpload,
  editorialUpload,
  dualCardUpload,
  followSectionUpload,
  productUpload,
  genericUpload,
  uploadHeroBannerImage,
  uploadShopByCategoryImage,
  uploadCategoryImage,
  uploadFeaturedSectionImage,
  uploadSalesBannerImage,
  uploadEditorialImage,
  uploadDualCardImage,
  uploadFollowSectionImage,
  uploadProductImage,
  uploadGenericFile,
} from '../controllers/upload.controller';

const router: Router = Router();

const multerErrorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    const messages: Record<string, string> = {
      LIMIT_FILE_SIZE: 'File is too large',
      LIMIT_FILE_COUNT: 'Too many files',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field',
      LIMIT_FIELD_KEY: 'Invalid field key',
      LIMIT_PART_COUNT: 'Too many parts',
      LIMIT_FIELD_VALUE: 'Field value too long',
      LIMIT_FIELD_COUNT: 'Too many fields',
    };
    res.status(400).json({
      success: false,
      message: messages[err.code] || err.message,
    });
    return;
  }

  if (err.message === 'Only image and video files are allowed') {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  next(err);
};

router.post(
  '/hero-banner',
  authenticateToken,
  requireAdmin,
  (req, res, next) => heroBannerUpload.single('file')(req, res, (err) => err ? multerErrorHandler(err, req, res, next) : next()),
  uploadHeroBannerImage,
);

const wrapMulter = (mw: any) => (req: Request, res: Response, next: NextFunction) =>
  mw(req, res, (err?: any) => err ? multerErrorHandler(err, req, res, next) : next());

router.post('/shop-by-category', authenticateToken, requireAdmin, wrapMulter(shopByCategoryUpload.single('file')), uploadShopByCategoryImage);
router.post('/category', authenticateToken, requireAdmin, wrapMulter(categoryUpload.single('file')), uploadCategoryImage);
router.post('/featured-section', authenticateToken, requireAdmin, wrapMulter(featuredSectionUpload.single('file')), uploadFeaturedSectionImage);
router.post('/sales-banner', authenticateToken, requireAdmin, wrapMulter(salesBannerUpload.single('file')), uploadSalesBannerImage);
router.post('/editorial', authenticateToken, requireAdmin, wrapMulter(editorialUpload.single('file')), uploadEditorialImage);
router.post('/dual-card', authenticateToken, requireAdmin, wrapMulter(dualCardUpload.single('file')), uploadDualCardImage);
router.post('/follow-section', authenticateToken, requireAdmin, wrapMulter(followSectionUpload.single('file')), uploadFollowSectionImage);
router.post('/file', authenticateToken, requireAdmin, wrapMulter(genericUpload.single('file')), uploadGenericFile);
router.post('/product', authenticateToken, requireAdmin, wrapMulter(productUpload.single('file')), uploadProductImage);

export default router;
