'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Upload, Plus, Trash2, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import type { ThreeImageGridColumnItem } from '../types';
import { DEFAULT_COLUMN } from '../types';

interface ThreeImageGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (columns: ThreeImageGridColumnItem[], isActive: boolean, order: number) => void;
  isSaving: boolean;
  isUploading: boolean;
  onUploadImage: (file: File) => Promise<string | null>;
  editingItem?: {
    id: string;
    isActive: boolean;
    order: number;
    columns: {
      id?: string;
      imageSrc: string;
      imageAlt: string;
      imageLink: string | null;
      productName: string | null;
      productPrice: number | null;
      productOriginalPrice: number | null;
      productImage: string | null;
      productLink: string | null;
      order: number;
    }[];
  } | null;
}

export function ThreeImageGridModal({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  isUploading,
  onUploadImage,
  editingItem,
}: ThreeImageGridModalProps) {
  const [columns, setColumns] = useState<ThreeImageGridColumnItem[]>(
    editingItem
      ? editingItem.columns.map((c) => ({
          id: c.id,
          imageSrc: c.imageSrc,
          imageAlt: c.imageAlt,
          imageLink: c.imageLink || '',
          productName: c.productName || '',
          productPrice: c.productPrice?.toString() || '',
          productOriginalPrice: c.productOriginalPrice?.toString() || '',
          productImage: c.productImage || '',
          productLink: c.productLink || '',
          order: c.order,
        }))
      : [{ ...DEFAULT_COLUMN }, { ...DEFAULT_COLUMN }, { ...DEFAULT_COLUMN }]
  );
  const [isActive, setIsActive] = useState(editingItem?.isActive ?? true);
  const [order, setOrder] = useState(editingItem?.order ?? 0);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingProductIndex, setUploadingProductIndex] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const productFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateColumn = (index: number, field: keyof ThreeImageGridColumnItem, value: string) => {
    setColumns((prev) => prev.map((col, i) => (i === index ? { ...col, [field]: value } : col)));
  };

  const addColumn = () => {
    setColumns((prev) => [...prev, { ...DEFAULT_COLUMN, order: prev.length }]);
  };

  const removeColumn = (index: number) => {
    if (columns.length <= 1) return;
    setColumns((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    const url = await onUploadImage(file);
    if (url) updateColumn(index, 'imageSrc', url);
    setUploadingIndex(null);
  };

  const handleProductImageUpload = async (index: number, file: File) => {
    setUploadingProductIndex(index);
    const url = await onUploadImage(file);
    if (url) updateColumn(index, 'productImage', url);
    setUploadingProductIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(columns, isActive, order);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 sm:items-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-t-xl sm:rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Three Image Grid' : 'Create Three Image Grid'}
                </h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ti-order">Order</label>
                      <input
                        id="ti-order"
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Columns ({columns.length})</h3>
                    <button type="button" onClick={addColumn} className="flex items-center gap-1 text-sm text-[#A68520] hover:text-[#8B6914]">
                      <Plus className="w-4 h-4" /> Add Column
                    </button>
                  </div>

                  {columns.map((col, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Column {index + 1}</span>
                        {columns.length > 1 && (
                          <button type="button" onClick={() => removeColumn(index)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-600" htmlFor={`ti-image-${index}`}>Image</label>
                          <input
                            id={`ti-image-${index}`}
                            type="text"
                            value={col.imageSrc}
                            onChange={(e) => updateColumn(index, 'imageSrc', e.target.value)}
                            placeholder="Image URL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                          />
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => fileRefs.current[index]?.click()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                fileRefs.current[index]?.click();
                              }
                            }}
                            className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#D4AF37] transition-colors"
                          >
                            {uploadingIndex === index ? (
                              <RotateCcw className="w-5 h-5 animate-spin text-gray-400" />
                            ) : col.imageSrc ? (
                              <div className="relative w-full h-full">
                                <Image src={col.imageSrc} alt="" fill className="object-contain rounded-lg" unoptimized />
                              </div>
                            ) : (
                              <Upload className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <input
                            ref={(el) => { fileRefs.current[index] = el; }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(index, file);
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-600" htmlFor={`ti-alt-${index}`}>Alt Text</label>
                          <input
                            id={`ti-alt-${index}`}
                            type="text"
                            value={col.imageAlt}
                            onChange={(e) => updateColumn(index, 'imageAlt', e.target.value)}
                            placeholder="Image alt text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                          />
                          <label className="block text-xs font-medium text-gray-600" htmlFor={`ti-link-${index}`}>Link</label>
                          <input
                            id={`ti-link-${index}`}
                            type="text"
                            value={col.imageLink}
                            onChange={(e) => updateColumn(index, 'imageLink', e.target.value)}
                            placeholder="/products"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                          />
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-3 space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase">Product Overlay (optional)</p>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={col.productName}
                            onChange={(e) => updateColumn(index, 'productName', e.target.value)}
                            placeholder="Product name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                          />
                          <input
                            type="text"
                            value={col.productLink}
                            onChange={(e) => updateColumn(index, 'productLink', e.target.value)}
                            placeholder="Product link"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={col.productPrice}
                            onChange={(e) => updateColumn(index, 'productPrice', e.target.value)}
                            placeholder="Price"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={col.productOriginalPrice}
                            onChange={(e) => updateColumn(index, 'productOriginalPrice', e.target.value)}
                            placeholder="Original price"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                          />
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={col.productImage}
                              onChange={(e) => updateColumn(index, 'productImage', e.target.value)}
                              placeholder="Product image URL"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => productFileRefs.current[index]?.click()}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Upload className="w-4 h-4 text-gray-500" />
                          </button>
                          <input
                            ref={(el) => { productFileRefs.current[index] = el; }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleProductImageUpload(index, file);
                            }}
                          />
                        </div>
                        {col.productImage && (
                          <div className="relative w-16 h-20">
                            <Image src={col.productImage} alt="" fill className="object-contain rounded" unoptimized />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="flex-1 bg-[#D4AF37] text-white px-4 py-2.5 rounded-lg hover:bg-[#C4A030] transition-colors disabled:opacity-50 font-semibold"
                  >
                    {isSaving ? 'Saving...' : editingItem ? 'Update' : 'Create'} Section
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-white text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
