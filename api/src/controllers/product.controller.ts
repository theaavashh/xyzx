import type { Request, RequestHandler, Response } from 'express';
import { productRepository } from '../repositories/product.repository';
import {
  asyncHandler,
  parseQuery,
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';
import { logger } from '../utils/logger';

export const getProducts: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, filters, sortBy, sortOrder } = parseQuery(req);

    const productFilters = {
      search: filters.search,
      categoryId: filters.categoryId,
      isActive: filters.isActive ? filters.isActive === 'true' : undefined,
      isFeatured: filters.isFeatured ? filters.isFeatured === 'true' : undefined,
      isNew: filters.isNew ? filters.isNew === 'true' : undefined,
      isOnSale: filters.isOnSale ? filters.isOnSale === 'true' : undefined,
      isBestSeller: filters.isBestSeller ? filters.isBestSeller === 'true' : undefined,
      isNewSeller: filters.isNewSeller ? filters.isNewSeller === 'true' : undefined,
      isFestivalOffer: filters.isFestivalOffer ? filters.isFestivalOffer === 'true' : undefined,
      isDigital: filters.isDigital ? filters.isDigital === 'true' : undefined,
      gender: filters.gender,
    };

    const result = await productRepository.findProducts(page, limit, productFilters, {
      sortBy,
      sortOrder,
    });

    sendSuccess(res, result.data, undefined, 200, result.pagination);
  },
);

export const getProductById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Product ID is required');
      return;
    }

    const product = await productRepository.findProductById(id);

    if (!product) {
      sendNotFound(res, 'Product not found');
      return;
    }

    sendSuccess(res, product);
  },
);

export const createProduct: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const productData = req.body;

    logger.debug('Creating product', { variants: productData.variants?.length });

    const slugExists = await productRepository.existsBySlug(productData.slug);
    if (slugExists) {
      sendConflict(res, 'Product with this slug already exists');
      return;
    }

    const { currencyPrices, pricingTiers, attributes, ...prismaData } = productData;

    const product = await productRepository.createProduct({
      name: prismaData.name,
      slug: prismaData.slug,
      productCode: prismaData.productCode,
      category: { connect: { id: prismaData.categoryId } },
      subCategoryId: prismaData.subCategoryId,
      description: prismaData.description,
      shortDescription: prismaData.shortDescription,
      disclaimer: prismaData.disclaimer,
      materialCare: prismaData.materialCare,
      gender: prismaData.gender,
      season: prismaData.season,
      material: prismaData.material,
      occasion: prismaData.occasion,
      fitType: prismaData.fitType,
      pattern: prismaData.pattern,
      sleeveStyle: prismaData.sleeveStyle,
      neckStyle: prismaData.neckStyle,
      washCare: prismaData.washCare,
      sku: prismaData.sku,
      barcode: prismaData.barcode,
      upc: prismaData.upc,
      ean: prismaData.ean,
      isbn: prismaData.isbn,
      trackQuantity: prismaData.trackQuantity ?? true,
      quantity: prismaData.quantity ?? 0,
      lowStockThreshold: prismaData.lowStockThreshold ?? 5,
      allowBackorder: prismaData.allowBackorder ?? false,
      manageStock: prismaData.manageStock ?? true,
      price: prismaData.price ?? 0,
      originalPrice: prismaData.originalPrice,
      costPrice: prismaData.costPrice,
      discountPercent: prismaData.discountPercent,
      weight: prismaData.weight,
      weightUnit: prismaData.weightUnit,
      dimensions: prismaData.dimensions,
      images: prismaData.images ?? [],
      videos: prismaData.videos ?? [],
      thumbnail: prismaData.thumbnail,
      seoTitle: prismaData.seoTitle,
      seoDescription: prismaData.seoDescription,
      seoKeywords: prismaData.seoKeywords ?? [],
      canonicalUrl: prismaData.canonicalUrl,
      robotsMeta: prismaData.robotsMeta,
      seoFriendlyImageFilename: prismaData.seoFriendlyImageFilename,
      imageAltText: prismaData.imageAltText,
      productSchema: prismaData.productSchema,
      brandSchema: prismaData.brandSchema,
      breadcrumbSchema: prismaData.breadcrumbSchema,
      itemListSchema: prismaData.itemListSchema,
      faqSchema: prismaData.faqSchema,
      ogTitle: prismaData.ogTitle,
      ogDescription: prismaData.ogDescription,
      ogImage: prismaData.ogImage,
      twitterCardMeta: prismaData.twitterCardMeta,
      productDescription: prismaData.productDescription,
      faqs: prismaData.faqs,
      isActive: prismaData.isActive ?? true,
      isDigital: prismaData.isDigital ?? false,
      isFeatured: prismaData.isFeatured ?? false,
      isNew: prismaData.isNew ?? false,
      isOnSale: prismaData.isOnSale ?? false,
      isBestSeller: prismaData.isBestSeller ?? false,
      isSales: prismaData.isSales ?? false,
      isNewSeller: prismaData.isNewSeller ?? false,
      isFestivalOffer: prismaData.isFestivalOffer ?? false,
      visibility: prismaData.visibility ?? 'VISIBLE',
      publishedAt: prismaData.publishedAt ? new Date(prismaData.publishedAt) : null,
      requiresShipping: prismaData.requiresShipping ?? true,
      shippingClass: prismaData.shippingClass,
      freeShipping: prismaData.freeShipping ?? false,
      taxable: prismaData.taxable ?? true,
      taxClass: prismaData.taxClass,
      customFields: prismaData.customFields,
      notes: prismaData.notes,
      isVariant: prismaData.isVariant ?? false,
      variantAttributes: prismaData.variantAttributes ?? [],
      selectedSizes: prismaData.selectedSizes ?? [],
      selectedColors: prismaData.selectedColors,
      variants: prismaData.variants,
      tags: prismaData.tags ?? [],
    });

    sendCreated(res, product, 'Product created successfully');
  },
);

export const updateProduct: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const productData = req.body;

    logger.debug('Updating product', { id, variants: productData.variants?.length });

    if (!id) {
      sendBadRequest(res, 'Product ID is required');
      return;
    }

    const exists = await productRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Product not found');
      return;
    }

    if (productData.slug) {
      const existingProduct = await productRepository.findProductById(id);
      if (existingProduct && productData.slug !== existingProduct.slug) {
        const slugExists = await productRepository.existsBySlug(productData.slug);
        if (slugExists) {
          sendConflict(res, 'Product with this slug already exists');
          return;
        }
      }
    }

    const { currencyPrices, pricingTiers, attributes, ...prismaData } = productData;

    const updatePayload: Record<string, any> = {
      name: prismaData.name,
      slug: prismaData.slug,
      productCode: prismaData.productCode,
      description: prismaData.description,
      shortDescription: prismaData.shortDescription,
      disclaimer: prismaData.disclaimer,
      materialCare: prismaData.materialCare,
      gender: prismaData.gender,
      season: prismaData.season,
      material: prismaData.material,
      occasion: prismaData.occasion,
      fitType: prismaData.fitType,
      pattern: prismaData.pattern,
      sleeveStyle: prismaData.sleeveStyle,
      neckStyle: prismaData.neckStyle,
      washCare: prismaData.washCare,
      sku: prismaData.sku,
      barcode: prismaData.barcode,
      upc: prismaData.upc,
      ean: prismaData.ean,
      isbn: prismaData.isbn,
      trackQuantity: prismaData.trackQuantity,
      quantity: prismaData.quantity,
      lowStockThreshold: prismaData.lowStockThreshold,
      allowBackorder: prismaData.allowBackorder,
      manageStock: prismaData.manageStock,
      price: prismaData.price,
      originalPrice: prismaData.originalPrice,
      costPrice: prismaData.costPrice,
      discountPercent: prismaData.discountPercent,
      weight: prismaData.weight,
      weightUnit: prismaData.weightUnit,
      dimensions: prismaData.dimensions,
      images: prismaData.images,
      videos: prismaData.videos,
      thumbnail: prismaData.thumbnail,
      seoTitle: prismaData.seoTitle,
      seoDescription: prismaData.seoDescription,
      seoKeywords: prismaData.seoKeywords,
      canonicalUrl: prismaData.canonicalUrl,
      robotsMeta: prismaData.robotsMeta,
      seoFriendlyImageFilename: prismaData.seoFriendlyImageFilename,
      imageAltText: prismaData.imageAltText,
      productSchema: prismaData.productSchema,
      brandSchema: prismaData.brandSchema,
      breadcrumbSchema: prismaData.breadcrumbSchema,
      itemListSchema: prismaData.itemListSchema,
      faqSchema: prismaData.faqSchema,
      ogTitle: prismaData.ogTitle,
      ogDescription: prismaData.ogDescription,
      ogImage: prismaData.ogImage,
      twitterCardMeta: prismaData.twitterCardMeta,
      productDescription: prismaData.productDescription,
      faqs: prismaData.faqs,
      isActive: prismaData.isActive,
      isDigital: prismaData.isDigital,
      isFeatured: prismaData.isFeatured,
      isNew: prismaData.isNew,
      isOnSale: prismaData.isOnSale,
      isBestSeller: prismaData.isBestSeller,
      isSales: prismaData.isSales,
      isNewSeller: prismaData.isNewSeller,
      isFestivalOffer: prismaData.isFestivalOffer,
      visibility: prismaData.visibility,
      publishedAt: prismaData.publishedAt ? new Date(prismaData.publishedAt) : (prismaData.publishedAt === '' ? null : undefined),
      requiresShipping: prismaData.requiresShipping,
      shippingClass: prismaData.shippingClass,
      freeShipping: prismaData.freeShipping,
      taxable: prismaData.taxable,
      taxClass: prismaData.taxClass,
      customFields: prismaData.customFields,
      notes: prismaData.notes,
      isVariant: prismaData.isVariant,
      variantAttributes: prismaData.variantAttributes,
      selectedSizes: prismaData.selectedSizes,
      selectedColors: prismaData.selectedColors,
      variants: prismaData.variants,
      tags: prismaData.tags,
    };

    if (prismaData.subCategoryId !== undefined) {
      updatePayload.subCategoryId = prismaData.subCategoryId;
    }

    Object.keys(updatePayload).forEach((key) => {
      if (updatePayload[key] === undefined) {
        delete updatePayload[key];
      }
    });

    try {
      const product = await productRepository.updateProduct(id, updatePayload);
      sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
    logger.error('Product update failed', { id }, error as Error);
      throw error;
    }
  },
);

export const deleteProduct: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      sendBadRequest(res, 'Product ID is required');
      return;
    }

    const exists = await productRepository.existsById(id);
    if (!exists) {
      sendNotFound(res, 'Product not found');
      return;
    }

    await productRepository.deleteProduct(id);

    sendSuccess(res, null, 'Product deleted successfully');
  },
);

export const bulkDeleteProducts: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      sendBadRequest(res, 'Product IDs are required');
      return;
    }

    const count = await productRepository.bulkDeleteProducts(ids);

    sendSuccess(res, { deletedCount: count }, `${count} products deleted successfully`);
  },
);
