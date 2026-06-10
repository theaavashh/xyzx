import type { Request, RequestHandler, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { asyncHandler, sendBadRequest, sendSuccess } from '../utils';

const UPLOADS_BASE = process.env.UPLOADS_PATH || path.join(__dirname, '..', '..', 'uploads');

const createUploadStorage = (subdir: string, prefix: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(UPLOADS_BASE, subdir);
      try {
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      } catch (err: any) {
        cb(err, '');
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    },
  });

const mediaFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowed = ['image/', 'video/'];
  if (allowed.some((type) => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};

const createUploadMiddleware = (subdir: string, prefix: string, maxSizeMB: number = 50) =>
  multer({
    storage: createUploadStorage(subdir, prefix),
    fileFilter: mediaFileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });

const heroBannerUpload = createUploadMiddleware('herobanner', 'hero-banner', 50);
const shopByCategoryUpload = createUploadMiddleware('shop-by-category', 'shop-by-category', 5);
const categoryUpload = createUploadMiddleware('category', 'category', 5);
const featuredSectionUpload = createUploadMiddleware('featured-section', 'featured-section', 10);
const salesBannerUpload = createUploadMiddleware('sales-banner', 'sales-banner', 10);
const editorialUpload = createUploadMiddleware('editorial', 'editorial', 10);
const dualCardUpload = createUploadMiddleware('dual-card', 'dual-card', 10);
const followSectionUpload = createUploadMiddleware('follow-section', 'follow-section', 5);
const productUpload = createUploadMiddleware('products', 'product', 10);

const handleUpload = (subdir: string) =>
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      sendBadRequest(res, 'No file uploaded');
      return;
    }

    const fileUrl = `/uploads/${subdir}/${req.file.filename}`;

    sendSuccess(
      res,
      {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      'File uploaded successfully',
    );
  });

export const uploadHeroBannerImage: RequestHandler = handleUpload('herobanner');
export const uploadShopByCategoryImage: RequestHandler = handleUpload('shop-by-category');
export const uploadCategoryImage: RequestHandler = handleUpload('category');
export const uploadFeaturedSectionImage: RequestHandler = handleUpload('featured-section');
export const uploadSalesBannerImage: RequestHandler = handleUpload('sales-banner');
export const uploadEditorialImage: RequestHandler = handleUpload('editorial');
export const uploadDualCardImage: RequestHandler = handleUpload('dual-card');
export const uploadFollowSectionImage: RequestHandler = handleUpload('follow-section');
export const uploadProductImage: RequestHandler = handleUpload('products');

export { heroBannerUpload, shopByCategoryUpload, categoryUpload, featuredSectionUpload, salesBannerUpload, editorialUpload, dualCardUpload, followSectionUpload, productUpload };

export const genericUpload = createUploadMiddleware('general', 'file', 50);

export const uploadGenericFile: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    sendBadRequest(res, 'No file uploaded');
    return;
  }

  const fileUrl = `/uploads/general/${req.file.filename}`;

  sendSuccess(
    res,
    {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
    'File uploaded successfully',
  );
});
