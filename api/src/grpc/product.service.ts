import type { handleUnaryCall } from '@grpc/grpc-js';
import { productRepository } from '../repositories/product.repository';
import { logger } from '../utils/logger';
import type { Pagination, ApiError } from './types';

interface Product { id: string; name: string; slug: string; price: number; isActive: boolean; [key: string]: any }
interface GetProductRequest { id: string }
interface PaginationRequest { page: number; limit: number; search: string; sortBy: string; sortOrder: string }
interface CreateProductRequest { name: string; slug: string; productCode?: string; categoryId?: string; description?: string; shortDescription?: string; price: number; originalPrice?: number; costPrice?: number; quantity: number; sku?: string; barcode?: string; gender?: string; images?: string[]; thumbnail?: string; isActive: boolean; isFeatured: boolean; isDigital: boolean; isVariant: boolean; variants?: any[]; tags?: string[]; seoTitle?: string; seoDescription?: string }
interface UpdateProductRequest { id: string; name?: string; slug?: string; description?: string; price?: number; quantity?: number; isActive?: boolean; isFeatured?: boolean; images?: string[] }
interface DeleteProductRequest { id: string }
interface BulkDeleteProductsRequest { ids: string[] }
interface ProductResponse { success: boolean; message: string; data: Product | null; error: ApiError | null }
interface ListProductsResponse { success: boolean; message: string; data: Product[]; pagination: Pagination | null; error: ApiError | null }

export const getProduct: handleUnaryCall<GetProductRequest, ProductResponse> = async (call, callback) => {
  try {
    const { id } = call.request;
    if (!id) { callback(null, { success: false, message: 'Product ID is required', data: null, error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    const product = await productRepository.findProductById(id);
    if (!product) { callback(null, { success: false, message: 'Product not found', data: null, error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    callback(null, { success: true, message: 'OK', data: product as any, error: null });
  } catch (error) {
    logger.error('gRPC GetProduct error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const listProducts: handleUnaryCall<PaginationRequest, ListProductsResponse> = async (call, callback) => {
  try {
    const { page, limit, search, sortBy, sortOrder } = call.request;
    const currentPage = page || 1;
    const currentLimit = limit || 20;
    const filters: any = {};
    if (search) filters.search = search;
    const result = await productRepository.findProducts(currentPage, currentLimit, filters, { sortBy: sortBy || 'createdAt', sortOrder: (sortOrder as 'asc' | 'desc') || 'desc' });
    callback(null, { success: true, message: 'OK', data: result.data as any[], pagination: { page: currentPage, limit: currentLimit, total: result.pagination.total, totalPages: result.pagination.pages }, error: null });
  } catch (error) {
    logger.error('gRPC ListProducts error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: [], pagination: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const createProduct: handleUnaryCall<CreateProductRequest, ProductResponse> = async (call, callback) => {
  try {
    const data = call.request;
    const slugExists = await productRepository.existsBySlug(data.slug);
    if (slugExists) { callback(null, { success: false, message: 'Slug already exists', data: null, error: { message: 'Conflict', code: 'CONFLICT', details: {} } }); return; }
    const product = await productRepository.createProduct({
      name: data.name, slug: data.slug, productCode: data.productCode, category: data.categoryId ? { connect: { id: data.categoryId } } : undefined,
      description: data.description, shortDescription: data.shortDescription, price: data.price || 0, originalPrice: data.originalPrice, costPrice: data.costPrice,
      quantity: data.quantity ?? 0, sku: data.sku, barcode: data.barcode, gender: data.gender, images: data.images || [], thumbnail: data.thumbnail,
      isActive: data.isActive ?? true, isFeatured: data.isFeatured ?? false, isDigital: data.isDigital ?? false, tags: data.tags || [],
      seoTitle: data.seoTitle, seoDescription: data.seoDescription,
    } as any);
    callback(null, { success: true, message: 'Product created', data: product as any, error: null });
  } catch (error) {
    logger.error('gRPC CreateProduct error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const updateProduct: handleUnaryCall<UpdateProductRequest, ProductResponse> = async (call, callback) => {
  try {
    const { id, ...updates } = call.request;
    if (!id) { callback(null, { success: false, message: 'Product ID is required', data: null, error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    const exists = await productRepository.existsById(id);
    if (!exists) { callback(null, { success: false, message: 'Product not found', data: null, error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    const payload: Record<string, any> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.slug !== undefined) payload.slug = updates.slug;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.quantity !== undefined) payload.quantity = updates.quantity;
    if (updates.isActive !== undefined) payload.isActive = updates.isActive;
    if (updates.isFeatured !== undefined) payload.isFeatured = updates.isFeatured;
    if (updates.images !== undefined) payload.images = updates.images;
    const product = await productRepository.updateProduct(id, payload);
    callback(null, { success: true, message: 'Product updated', data: product as any, error: null });
  } catch (error) {
    logger.error('gRPC UpdateProduct error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', data: null, error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const deleteProduct: handleUnaryCall<DeleteProductRequest, any> = async (call, callback) => {
  try {
    const { id } = call.request;
    if (!id) { callback(null, { success: false, message: 'Product ID is required', error: { message: 'Missing ID', code: 'INVALID', details: {} } }); return; }
    const exists = await productRepository.existsById(id);
    if (!exists) { callback(null, { success: false, message: 'Product not found', error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    await productRepository.deleteProduct(id);
    callback(null, { success: true, message: 'Product deleted', error: null });
  } catch (error) {
    logger.error('gRPC DeleteProduct error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const bulkDeleteProducts: handleUnaryCall<BulkDeleteProductsRequest, any> = async (call, callback) => {
  try {
    const { ids } = call.request;
    if (!ids || ids.length === 0) { callback(null, { success: false, message: 'Product IDs required', error: { message: 'Missing IDs', code: 'INVALID', details: {} } }); return; }
    const count = await productRepository.bulkDeleteProducts(ids);
    callback(null, { success: true, message: `${count} products deleted`, error: null });
  } catch (error) {
    logger.error('gRPC BulkDeleteProducts error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const productHandlers = {
  GetProduct: getProduct,
  ListProducts: listProducts,
  CreateProduct: createProduct,
  UpdateProduct: updateProduct,
  DeleteProduct: deleteProduct,
  BulkDeleteProducts: bulkDeleteProducts,
};
