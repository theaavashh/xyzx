'use client';

import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import EnhancedProductForm from '@/components/EnhancedProductForm';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useProducts,
  useCategoriesForProducts,
  useCreateProduct,
  useUpdateProduct,
  useToggleProductStatus,
  fetchProductById,
  ProductStatsCards,
  ProductFilters,
  ProductsTable,
  ProductPreviewModal,
  ProductDeleteAlert,
} from '@/features/products';
import type { Product, ProductFormData } from '@/types';

export default function ProductsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState({
    isOpen: false,
    productId: '',
    productName: '',
    productImage: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy] = useState('createdAt');
  const [sortOrder] = useState('desc');

  const productsQuery = useProducts({
    page: currentPage,
    limit: itemsPerPage,
    sortBy,
    sortOrder,
    search: debouncedSearchQuery,
    categoryId: categoryFilter,
    status: statusFilter,
  });

  const categoriesQuery = useCategoriesForProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const toggleStatusMutation = useToggleProductStatus();

  const categories = categoriesQuery.data ?? [];
  const products = productsQuery.data?.products ?? [];
  const pagination = productsQuery.data?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  };
  const isLoadingProducts = productsQuery.isLoading;
  const error = productsQuery.error
    ? productsQuery.error instanceof Error
      ? productsQuery.error.message
      : 'Failed to load products'
    : null;

  const stats = useMemo(() => {
    const total = pagination.total;
    const active = products.filter((p) => p.isActive).length;
    const inactive = total - active;
    const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= 5).length;
    return { total, active, inactive, lowStock };
  }, [products, pagination.total]);

  const hasActiveFilters = !!(searchQuery || categoryFilter || statusFilter);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setCategoryFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);

  const handleEditProduct = useCallback(async (product: Product) => {
    try {
      const completeProductData = await fetchProductById(product.id);
      setEditingProduct(completeProductData as unknown as Product);
    } catch {
      setEditingProduct(product);
    }
    setShowAddModal(true);
  }, []);

  const handlePreviewProduct = useCallback(async (product: Product) => {
    try {
      const result = await fetchProductById(product.id);
      setPreviewProduct(result as unknown as Product);
    } catch {
      setPreviewProduct(product);
    }
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const product = products.find((p: Product) => p.id === id);
      if (product) {
        setDeleteAlert({
          isOpen: true,
          productId: id,
          productName: product.name,
          productImage:
            product.images && product.images.length > 0 ? product.images[0] : '',
        });
      }
    },
    [products],
  );

  const handleStatusToggle = useCallback(
    (id: string, isActive: boolean) => {
      toggleStatusMutation.mutate({ id, isActive });
    },
    [toggleStatusMutation],
  );

  const handleSubmit = useCallback(
    async (data: ProductFormData) => {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, data });
        setShowAddModal(false);
        setEditingProduct(null);
      } else {
        await createMutation.mutateAsync(data);
        setShowAddModal(false);
      }
    },
    [editingProduct, updateMutation, createMutation],
  );

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingProduct(null);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteAlert({ isOpen: false, productId: '', productName: '', productImage: '' });
  }, []);

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout title="Product Management" showBackButton={true}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black lastik">Products</h1>
            <p className="text-black text-lg mt-2">
              Manage your product catalog
            </p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            className="bg-[#D4AF37] text-white px-4 py-2.5 lastik text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        <ProductStatsCards
          total={stats.total}
          active={stats.active}
          inactive={stats.inactive}
          lowStock={stats.lowStock}
        />

        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          showFilterPanel={showFilterPanel}
          onToggleFilterPanel={() => setShowFilterPanel(true)}
          onCloseFilterPanel={() => setShowFilterPanel(false)}
        />

        <ProductsTable
          products={products}
          pagination={pagination}
          selectedIds={selectedIds}
          isLoading={isLoadingProducts}
          error={error}
          hasActiveFilters={hasActiveFilters}
          onSelectionChange={setSelectedIds}
          onAddProduct={() => {
            setEditingProduct(null);
            setShowAddModal(true);
          }}
          onClearFilters={clearFilters}
          onEdit={handleEditProduct}
          onPreview={handlePreviewProduct}
          onStatusToggle={handleStatusToggle}
          onDelete={handleDelete}
          onPageChange={setCurrentPage}
        />
      </div>

      <EnhancedProductForm
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingProduct as unknown as ProductFormData | undefined}
        isLoading={isLoading}
        categories={categories}
      />

      <ProductDeleteAlert
        isOpen={deleteAlert.isOpen}
        productId={deleteAlert.productId}
        productName={deleteAlert.productName}
        productImage={deleteAlert.productImage}
        onClose={handleCloseDelete}
        onDeleted={handleCloseDelete}
      />

      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        onEdit={handleEditProduct}
      />
    </DashboardLayout>
  );
}
