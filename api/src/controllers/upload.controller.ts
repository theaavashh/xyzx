import type { Request, RequestHandler, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { asyncHandler, sendBadRequest, sendSuccess } from '../utils';

interface MagicCheck {
  offset: number;
  bytes: number[];
}

const MAGIC_BYTES: Record<string, MagicCheck[]> = {
  'image/jpeg': [{ offset: 0, bytes: [0xFF, 0xD8, 0xFF] }],
  'image/png': [{ offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47] }],
  'image/gif': [{ offset: 0, bytes: [0x47, 0x49, 0x46] }],
  'image/webp': [
    { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
    { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
  ],
  'video/mp4': [{ offset: 0, bytes: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70] }],
  'video/webm': [{ offset: 0, bytes: [0x1A, 0x45, 0xDF, 0xA3] }],
};

const validateMagicBytes = (filePath: string, mimeType: string): boolean => {
  const checks = MAGIC_BYTES[mimeType];
  if (!checks) return true;
  try {
    const maxOffset = Math.max(...checks.map((c) => c.offset + c.bytes.length));
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(maxOffset);
    fs.readSync(fd, buf, 0, maxOffset, 0);
    fs.closeSync(fd);
    return checks.every((check) =>
      check.bytes.every((byte, i) => buf[check.offset + i] === byte),
    );
  } catch {
    return false;
  }
};

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
      const ext = path.extname(file.originalname).toLowerCase();
      const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm'];
      const safeExt = allowedExts.includes(ext) ? ext : '.bin';
      cb(null, `${prefix}-${uniqueSuffix}${safeExt}`);
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

const createUploadMiddleware = (subdir: string, prefix: string, maxSizeMB: number = 10) =>
  multer({
    storage: createUploadStorage(subdir, prefix),
    fileFilter: mediaFileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });

const heroBannerUpload = createUploadMiddleware('herobanner', 'hero-banner', 10);
const shopByCategoryUpload = createUploadMiddleware('shop-by-category', 'shop-by-category', 5);
const categoryUpload = createUploadMiddleware('category', 'category', 5);
const heroSlideUpload = createUploadMiddleware('hero-slide', 'hero-slide', 10);
const categoryGridUpload = createUploadMiddleware('category-grid', 'category-grid', 10);
const imageGridUpload = createUploadMiddleware('image-grid', 'image-grid', 10);
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

    if (!validateMagicBytes(req.file.path, req.file.mimetype)) {
      fs.unlink(req.file.path, () => {});
      sendBadRequest(res, 'File content does not match its declared type');
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
export const uploadHeroSlideImage: RequestHandler = handleUpload('hero-slide');
export const uploadCategoryGridImage: RequestHandler = handleUpload('category-grid');
export const uploadImageGridImage: RequestHandler = handleUpload('image-grid');
export const uploadFeaturedSectionImage: RequestHandler = handleUpload('featured-section');
export const uploadSalesBannerImage: RequestHandler = handleUpload('sales-banner');
export const uploadEditorialImage: RequestHandler = handleUpload('editorial');
export const uploadDualCardImage: RequestHandler = handleUpload('dual-card');
export const uploadFollowSectionImage: RequestHandler = handleUpload('follow-section');
export const uploadProductImage: RequestHandler = handleUpload('products');

export { heroBannerUpload, shopByCategoryUpload, categoryUpload, heroSlideUpload, categoryGridUpload, imageGridUpload, featuredSectionUpload, salesBannerUpload, editorialUpload, dualCardUpload, followSectionUpload, productUpload };

export const genericUpload = createUploadMiddleware('general', 'file', 10);

export const uploadGenericFile: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    sendBadRequest(res, 'No file uploaded');
    return;
  }

  if (!validateMagicBytes(req.file.path, req.file.mimetype)) {
    fs.unlink(req.file.path, () => {});
    sendBadRequest(res, 'File content does not match its declared type');
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
