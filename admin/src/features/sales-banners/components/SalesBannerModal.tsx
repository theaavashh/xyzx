'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import type { SalesBanner, SalesBannerFormData } from '../types';

interface SalesBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBanner: SalesBanner | null;
  form: SalesBannerFormData;
  onFormChange: (field: string, value: string | number | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUploading: boolean;
  onImageUpload: () => void;
}

export function SalesBannerModal({
  isOpen,
  onClose,
  editingBanner,
  form,
  onFormChange,
  onSubmit,
  isUploading,
  onImageUpload,
}: SalesBannerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 font-keynord">
                {editingBanner ? 'Edit Banner' : 'Add Banner'}
              </h2>
              <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg" aria-label="Close modal">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
                <div className="space-y-2">
                  {form.image ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img src={form.image} alt="Preview" className="w-full h-48 object-contain" />
                      <button
                        type="button"
                        onClick={() => onFormChange('image', '')}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-lg hover:bg-black/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={onImageUpload}
                      disabled={isUploading}
                      className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37] hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4AF37]" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-sm text-gray-500">Upload image</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => onFormChange('title', e.target.value)}
                  placeholder="Summer Sale"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  id="subtitle"
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => onFormChange('subtitle', e.target.value)}
                  placeholder="Up to 50% off on selected items"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    id="buttonText"
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => onFormChange('buttonText', e.target.value)}
                    placeholder="Shop Now"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                  />
                </div>
                <div>
                  <label htmlFor="buttonUrl" className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                  <input
                    id="buttonUrl"
                    type="url"
                    value={form.buttonUrl}
                    onChange={(e) => onFormChange('buttonUrl', e.target.value)}
                    placeholder="/sale"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => onFormChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors"
                >
                  {editingBanner ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
