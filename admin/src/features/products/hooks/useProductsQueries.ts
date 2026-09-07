'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/apiClient';
import type { Product, Variant, CurrencyPrice, ProductFormData } from '@/types';
import type { ProductsApiResponse, ProductApiResponse, SimpleActionResponse, CategoryFilterItem } from '../types';

const PRODUCTS_KEY = 'products';

const currencyMap: Record<string, string> = {
  'United States': 'USD', USA: 'USD', UK: 'GBP', 'United Kingdom': 'GBP',
  Australia: 'AUD', Canada: 'CAD', India: 'INR', China: 'CNY',
  Japan: 'JPY', Singapore: 'SGD', UAE: 'AED', Nepal: 'NPR',
};

const symbolMap: Record<string, string> = {
  'United States': '$', USA: '$', UK: '£', 'United Kingdom': '£',
  Australia: '$', Canada: '$', India: '₹', China: '¥',
  Japan: '¥', Singapore: '$', UAE: 'د.إ', Nepal: 'NPR',
};

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return imagePath;
  return `/${imagePath}`;
}

function getCurrencyForCountry(country: string): string {
  return currencyMap[country] || 'USD';
}

function getSymbolForCountry(country: string): string {
  return symbolMap[country] || '$';
}

export function transformProductFormData(productData: ProductFormData): Record<string, unknown> {
  return {
    ...productData,
    subCategoryId: productData.subCategoryId || undefined,
    currencyPrices:
      productData.currencyPrices && productData.currencyPrices.length > 0
        ? productData.currencyPrices.map((cp: CurrencyPrice) => ({
            country: cp.country,
            currency: cp.currency || getCurrencyForCountry(cp.country),
            symbol: cp.symbol || getSymbolForCountry(cp.country),
            price: cp.price,
            comparePrice:
              cp.comparePrice !== undefined && cp.comparePrice !== null
                ? cp.comparePrice
                : undefined,
            minDeliveryDays: cp.minDeliveryDays || 1,
            maxDeliveryDays: cp.maxDeliveryDays || 7,
            isActive: cp.isActive !== false,
          }))
        : [
            {
              country: 'USA',
              currency: 'USD',
              symbol: '$',
              price: productData.price && productData.price > 0 ? productData.price : 1,
              minDeliveryDays: 1,
              maxDeliveryDays: 7,
              isActive: true,
            },
          ],
    sku: productData.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    trackQuantity: productData.trackQuantity !== false,
    manageStock: productData.manageStock !== false,
    requiresShipping: productData.requiresShipping !== false,
    taxable: productData.taxable !== false,
    ...(productData.weight && productData.weight > 0 && { weight: Number(productData.weight) }),
    ...(productData.weightUnit && productData.weightUnit.trim() && { weightUnit: productData.weightUnit }),
    ...(productData.dimensions && {
      dimensions: {
        length: productData.dimensions.length || 0,
        width: productData.dimensions.width || 0,
        height: productData.dimensions.height || 0,
        unit: productData.dimensions.unit || 'cm',
      },
    }),
    variants:
      productData.variants && productData.variants.length > 0
        ? productData.variants.map((variant: Variant) => ({
            ...variant,
            options:
              variant.options && variant.options.length > 0
                ? variant.options.map((option) => ({
                    ...option,
                    price: option.price !== undefined ? Number(option.price) : undefined,
                    comparePrice: option.comparePrice !== undefined ? Number(option.comparePrice) : undefined,
                    weight: option.weight !== undefined ? Number(option.weight) : undefined,
                    additionalCost: option.additionalCost !== undefined ? Number(option.additionalCost) : 0,
                    stock: option.stock !== undefined ? Number(option.stock) : 0,
                  }))
                : [],
          }))
        : [],
    currency: undefined,
    symbol: undefined,
  };
}

export function normalizeProductDetail(data: Record<string, unknown>): Record<string, unknown> {
  return {
    ...data,
    shortDescription: (data as any).shortDescription || '',
    disclaimer: (data as any).disclaimer || '',
    materialCare: (data as any).materialCare || '',
    gender: (data as any).gender || '',
    season: (data as any).season || '',
    material: (data as any).material || '',
    occasion: (data as any).occasion || '',
    fitType: (data as any).fitType || '',
    pattern: (data as any).pattern || '',
    sleeveStyle: (data as any).sleeveStyle || '',
    neckStyle: (data as any).neckStyle || '',
    washCare: (data as any).washCare || '',
    barcode: (data as any).barcode || '',
    upc: (data as any).upc || '',
    ean: (data as any).ean || '',
    isbn: (data as any).isbn || '',
    trackQuantity: (data as any).trackQuantity !== undefined ? (data as any).trackQuantity : true,
    lowStockThreshold: (data as any).lowStockThreshold || 5,
    allowBackorder: (data as any).allowBackorder || false,
    manageStock: (data as any).manageStock !== undefined ? (data as any).manageStock : true,
    weight: (data as any).weight || 0,
    weightUnit: (data as any).weightUnit || 'kg',
    dimensions: (data as any).dimensions || { length: 0, width: 0, height: 0, unit: 'cm' },
    images: (data as any).images || [],
    videos: (data as any).videos || [],
    thumbnail: (data as any).thumbnail || '',
    seoTitle: (data as any).seoTitle || '',
    seoDescription: (data as any).seoDescription || '',
    seoKeywords: (data as any).seoKeywords || [],
    isActive: (data as any).isActive !== undefined ? (data as any).isActive : true,
    isDigital: (data as any).isDigital || false,
    isFeatured: (data as any).isFeatured || false,
    isNew: (data as any).isNew || false,
    isOnSale: (data as any).isOnSale || false,
    isBestSeller: (data as any).isBestSeller || false,
    isSales: (data as any).isSales || false,
    isNewSeller: (data as any).isNewSeller || false,
    isFestivalOffer: (data as any).isFestivalOffer || false,
    visibility: (data as any).visibility || 'VISIBLE',
    publishedAt: (data as any).publishedAt || '',
    requiresShipping: (data as any).requiresShipping !== undefined ? (data as any).requiresShipping : true,
    shippingClass: (data as any).shippingClass || '',
    freeShipping: (data as any).freeShipping || false,
    taxable: (data as any).taxable !== undefined ? (data as any).taxable : true,
    taxClass: (data as any).taxClass || '',
    customFields: (data as any).customFields || [],
    notes: (data as any).notes || '',
    variantAttributes: (data as any).variantAttributes || [],
    variants: (data as any).variants || [],
    slug: (data as any).slug || (data as any).productCode || '',
    categoryId: (data as any).categoryId || '',
    subCategoryId: (data as any).subCategoryId || '',
    pricingTiers: (data as any).pricingTiers || [],
    currencyPrices: (data as any).currencyPrices || [],
    attributes: (data as any).attributes || [],
  };
}

export function useProducts(params: {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search?: string;
  categoryId?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, params],
    queryFn: async () => {
      const queryParams: Record<string, unknown> = {
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      };
      if (params.search) queryParams['filters.search'] = params.search;
      if (params.categoryId) queryParams['filters.categoryId'] = params.categoryId;
      if (params.status === 'active') queryParams['filters.isActive'] = 'true';
      if (params.status === 'inactive') queryParams['filters.isActive'] = 'false';

      const res = await api.get<ProductsApiResponse>('/api/v1/products', { params: queryParams });

      if (res.data.success) {
        const products = Array.isArray(res.data.data) ? res.data.data : (res.data.data as any).products || [];
        return {
          products: products as Product[],
          pagination: res.data.pagination || { page: params.page, limit: params.limit, total: 0, pages: 0 },
        };
      }
      throw new Error(res.data.message || 'Failed to fetch products');
    },
  });
}

export function useCategoriesForProducts() {
  return useQuery({
    queryKey: ['categories-for-products'],
    queryFn: async () => {
      const res = await api.get<any>('/api/v1/categories');
      if (res.data.success) {
        const categoriesData = res.data.data;
        if (!categoriesData) return [] as CategoryFilterItem[];

        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : (categoriesData.categories ?? []);

        if (!Array.isArray(categoriesArray)) return [] as CategoryFilterItem[];

        return categoriesArray.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
          children:
            cat.children?.map((child: any) => ({
              id: child.id,
              name: child.name,
              slug: child.slug || child.name.toLowerCase().replace(/\s+/g, '-'),
            })) || [],
        })) as CategoryFilterItem[];
      }
      return [] as CategoryFilterItem[];
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productData: ProductFormData) => {
      const transformedData = transformProductFormData(productData);
      const res = await api.post<SimpleActionResponse>('/api/v1/products', transformedData);
      if (!res.data.success) throw new Error(res.data.message || 'Failed to create product');
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success('Product created successfully!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const transformedData = transformProductFormData(data);
      const res = await api.put<SimpleActionResponse>(`/api/v1/products/${id}`, transformedData);
      if (!res.data.success) throw new Error(res.data.message || 'Failed to update product');
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success('Product updated successfully!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.delete<SimpleActionResponse>(`/api/v1/products/${productId}`);
      if (!res.data.success) throw new Error(res.data.message || 'Failed to delete product');
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success('Product deleted successfully!');
    },
    onError: (err: any) => {
      const message = err?.message || 'Failed to delete product';
      toast.error(message);
    },
  });
}

export function useToggleProductStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.patch(`/api/v1/products/${id}`, { isActive });
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success(`Product ${variables.isActive ? 'activated' : 'deactivated'}`);
    },
    onError: () => {
      toast.error('Failed to update product status');
    },
  });
}

export async function fetchProductById(id: string): Promise<Record<string, unknown>> {
  const res = await api.get<ProductApiResponse>(`/api/v1/products/${id}`);
  if (res.data.success && res.data.data) {
    return normalizeProductDetail(res.data.data);
  }
  throw new Error('Failed to fetch product');
}
