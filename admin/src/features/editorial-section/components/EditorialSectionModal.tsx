'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ImageIcon,
  Package,
  RefreshCw,
  X,
} from 'lucide-react';
import { FEATURE_OPTIONS } from '../types';
import type { EditorialSection, EditorialSectionFormData, ProductItem } from '../types';

interface EditorialSectionModalProps {
  isOpen: boolean;
  editingSection: EditorialSection | null;
  form: EditorialSectionFormData;
  isFetchingProducts: boolean;
  fetchedProducts: ProductItem[];
  selectedProductIds: Set<string>;
  onFormChange: (field: string, value: string | boolean) => void;
  onFetchProducts: (feature: string) => void;
  onToggleProduct: (productId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  getProductThumb: (product: ProductItem) => string;
}

export function EditorialSectionModal({
  isOpen,
  editingSection,
  form,
  isFetchingProducts,
  fetchedProducts,
  selectedProductIds,
  onFormChange,
  onFetchProducts,
  onToggleProduct,
  onSubmit,
  onClose,
  getProductThumb,
}: EditorialSectionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-semibold text-black lastik">
                  {editingSection ? 'Edit Section' : 'New Section'}
                </h2>
                <p className="text-sm text-gray-500">{editingSection ? 'Update section details and products' : 'Create a new editorial showcase'}</p>
              </div>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Season <span className="text-red-400">*</span></label>
                  <input type="text" value={form.season}
                    onChange={(e) => onFormChange('season', e.target.value)}
                    placeholder="SPRING / SUMMER 26"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black text-sm placeholder:text-gray-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Title <span className="text-red-400">*</span></label>
                  <input type="text" value={form.title}
                    onChange={(e) => onFormChange('title', e.target.value)}
                    placeholder="New Collection"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black text-sm placeholder:text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea value={form.description}
                  onChange={(e) => onFormChange('description', e.target.value)}
                  rows={2} placeholder="Brief description of the collection..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black text-sm resize-none placeholder:text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">CTA Text</label>
                  <input type="text" value={form.ctaText}
                    onChange={(e) => onFormChange('ctaText', e.target.value)}
                    placeholder="Shop Now"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black text-sm placeholder:text-gray-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">CTA Link</label>
                  <input type="text" value={form.ctaLink}
                    onChange={(e) => onFormChange('ctaLink', e.target.value)}
                    placeholder="/products"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black text-sm placeholder:text-gray-400" />
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Product Feature <span className="text-red-400">*</span></label>
                    <p className="text-xs text-gray-500 mt-0.5">Select a product feature to populate the section</p>
                  </div>
                  {form.featureType && (
                    <button type="button" onClick={() => onFetchProducts(form.featureType)}
                      disabled={isFetchingProducts}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
                      <RefreshCw className={`w-3.5 h-3.5 ${isFetchingProducts ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  )}
                </div>

                <select
                  value={form.featureType}
                  onChange={(e) => {
                    const val = e.target.value;
                    onFormChange('featureType', val);
                    if (val) onFetchProducts(val);
                  }}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black bg-white"
                >
                  <option value="">Select a feature...</option>
                  {FEATURE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                {isFetchingProducts && (
                  <div className="flex items-center gap-2.5 py-3 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#D4AF37] border-t-transparent" />
                    Loading products...
                  </div>
                )}

                {fetchedProducts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-600">
                        {fetchedProducts.length} product{fetchedProducts.length !== 1 ? 's' : ''} found
                      </span>
                      <span className="text-xs font-medium text-gray-600">
                        {selectedProductIds.size}/4 selected
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto">
                      {fetchedProducts.map((product) => {
                        const thumb = getProductThumb(product);
                        const isSelected = selectedProductIds.has(product.id);
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => onToggleProduct(product.id)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              isSelected
                                ? 'border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]'
                                : 'border-gray-200 hover:border-gray-300'
                            } bg-white`}
                            title={product.name}
                          >
                            {thumb ? (
                              <img src={thumb} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <ImageIcon className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center shadow">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-1 py-1.5">
                              <p className="text-[10px] text-white font-medium truncate text-center leading-tight">
                                {product.name}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!isFetchingProducts && form.featureType && fetchedProducts.length === 0 && (
                  <div className="text-center py-6">
                    <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No products found for this feature.</p>
                    <p className="text-xs text-gray-400 mt-1">You can still save the section and add products later.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div className="relative">
                    <input type="checkbox" checked={form.isActive}
                      onChange={(e) => onFormChange('isActive', e.target.checked)}
                      className="sr-only" />
                    <div className={`w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-[#D4AF37]' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={onClose}
                  className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                  Cancel
                </button>
                <button type="submit"
                  className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-semibold">
                  {editingSection ? 'Update Section' : 'Create Section'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
