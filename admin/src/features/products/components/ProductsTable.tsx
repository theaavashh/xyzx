'use client';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  EyeOff,
  Package,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import { Fragment } from 'react';
import type { Product, Variant } from '@/types';
import { getImageUrl } from '../hooks/useProductsQueries';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProductsTableProps {
  products: Product[];
  pagination: PaginationInfo;
  selectedIds: string[];
  isLoading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onSelectionChange: (ids: string[]) => void;
  onAddProduct: () => void;
  onClearFilters: () => void;
  onEdit: (product: Product) => void;
  onPreview: (product: Product) => void;
  onStatusToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export default function ProductsTable({
  products,
  pagination,
  selectedIds,
  isLoading,
  error,
  hasActiveFilters,
  onSelectionChange,
  onAddProduct,
  onClearFilters,
  onEdit,
  onPreview,
  onStatusToggle,
  onDelete,
  onPageChange,
}: ProductsTableProps) {
  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);
  const allSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id));

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-50 rounded w-1/4" />
                </div>
                <div className="h-8 bg-gray-100 rounded w-20" />
                <div className="h-8 bg-gray-100 rounded w-16" />
                <div className="h-8 bg-gray-100 rounded w-16" />
                <div className="h-8 bg-gray-100 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center py-20"
      >
        <div className="text-center max-w-sm">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 outer-sans">Error Loading Products</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center py-20"
      >
        <div className="text-center max-w-sm">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 outer-sans">
            {hasActiveFilters ? 'No Results Found' : 'No Products Yet'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first product'}
          </p>
          {hasActiveFilters ? (
                <button
                  onClick={onClearFilters}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
          ) : (
            <button
              onClick={onAddProduct}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="w-12 px-3 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => {
                    if (allSelected) {
                      onSelectionChange([]);
                    } else {
                      onSelectionChange(products.map((p) => p.id));
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                />
              </th>
              <th className="w-10 px-2 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">#</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">Image</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">Product</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">Variants</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">Category</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">Price</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">Stock</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product, index) => (
              <Fragment key={product.id}>
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`transition-colors ${
                    selectedIds.includes(product.id)
                      ? 'bg-amber-50/60'
                      : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50/30'
                  } hover:bg-amber-50/30`}
                >
                  <td className="w-12 px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => {
                        onSelectionChange(
                          selectedIds.includes(product.id)
                            ? selectedIds.filter((id) => id !== product.id)
                            : [...selectedIds, product.id]
                        );
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                    />
                  </td>
                  <td className="w-10 px-2 py-4 text-center text-sm text-gray-500">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 ring-1 ring-gray-200 shadow-sm">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/image.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-gray-900">{product.name}</span>
                      <span className="text-sm text-gray-400 font-mono">{product.sku || product.productCode || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {product.variants && product.variants.length > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg">
                        {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-900">${product.price?.toFixed(2)}</span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-xs text-gray-400 line-through ml-1">${product.comparePrice?.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-medium ${
                      product.quantity > 10
                        ? 'text-emerald-600'
                        : product.quantity > 0
                          ? 'text-amber-600'
                          : 'text-red-600'
                    }`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-medium ${product.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </motion.tr>
                <tr className="border-t-0">
                  <td colSpan={9} className="px-4 py-3 bg-gray-50/40">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {product.shortDescription && (
                        <span className="truncate max-w-[200px] sm:max-w-[280px]">{product.shortDescription}</span>
                      )}
                      {product.tags && product.tags.length > 0 && (
                        <span className="items-center gap-1.5 shrink-0 hidden sm:flex">
                          {product.tags.slice(0, 3).map((t, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px]">{t}</span>
                          ))}
                        </span>
                      )}
                      <span className="hidden lg:flex items-center gap-3 ml-auto shrink-0">
                        {product.barcode && (
                          <span className="font-mono text-gray-400 shrink-0">BAR: {product.barcode}</span>
                        )}
                        {product.upc && (
                          <span className="font-mono text-gray-400 shrink-0">UPC: {product.upc}</span>
                        )}
                        {product.material && (
                          <span className="shrink-0">{product.material}</span>
                        )}
                        <span className="text-gray-400">
                          {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => onPreview(product)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onStatusToggle(product.id, !product.isActive)}
                          className={`p-1.5 rounded-lg transition ${
                            product.isActive
                              ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={product.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {product.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-sm text-gray-500 order-2 sm:order-1">
            Showing <span className="font-medium text-gray-700">{startIndex}</span>
            {' '}–{' '}
            <span className="font-medium text-gray-700">{endIndex}</span>
            {' '}of{' '}
            <span className="font-medium text-gray-700">{pagination.total}</span>
          </p>
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter((page) => page === 1 || page === pagination.pages || Math.abs(page - pagination.page) <= 1)
                .map((page, idx, arr) => {
                  const prevPage = arr[idx - 1] ?? page;
                  const showEllipsis = idx > 0 && page - prevPage > 1;
                  return (
                    <span key={page} className="flex items-center">
                      {showEllipsis && <span className="px-1.5 text-gray-300 text-sm">...</span>}
                      <button
                        onClick={() => onPageChange(page)}
                        className={`min-w-[36px] rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                          pagination.page === page
                            ? 'bg-[#D4AF37] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    </span>
                  );
                })}
            </div>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="inline-flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
