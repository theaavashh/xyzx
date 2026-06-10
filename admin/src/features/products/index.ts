export type { ProductsApiResponse, ProductApiResponse, SimpleActionResponse, CategoryFilterItem } from './types';

export {
  useProducts,
  useCategoriesForProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useToggleProductStatus,
  fetchProductById,
  getImageUrl,
  transformProductFormData,
  normalizeProductDetail,
} from './hooks/useProductsQueries';

export { default as ProductStatsCards } from './components/ProductStatsCards';
export { default as ProductFilters } from './components/ProductFilters';
export { default as ProductsTable } from './components/ProductsTable';
export { default as ProductPreviewModal } from './components/ProductPreviewModal';
export { default as ProductDeleteAlert } from './components/ProductDeleteAlert';
