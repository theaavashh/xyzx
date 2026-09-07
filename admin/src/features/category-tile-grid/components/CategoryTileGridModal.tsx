'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Upload, Plus, Trash2, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import type { CategoryTileGridItem } from '../types';
import { DEFAULT_ITEM } from '../types';

interface CategoryTileGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (items: CategoryTileGridItem[], isActive: boolean, order: number) => void;
  isSaving: boolean;
  isUploading: boolean;
  onUploadImage: (file: File) => Promise<string | null>;
  editingItem?: {
    id: string;
    isActive: boolean;
    order: number;
    items: {
      id?: string;
      title: string;
      subtitle: string | null;
      image: string;
      link: string;
      order: number;
    }[];
  } | null;
}

export function CategoryTileGridModal({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  isUploading,
  onUploadImage,
  editingItem,
}: CategoryTileGridModalProps) {
  const [items, setItems] = useState<CategoryTileGridItem[]>(
    editingItem
      ? editingItem.items.map((c) => ({
          id: c.id,
          title: c.title,
          subtitle: c.subtitle || '',
          image: c.image,
          link: c.link,
          order: c.order,
        }))
      : [{ ...DEFAULT_ITEM }, { ...DEFAULT_ITEM }, { ...DEFAULT_ITEM }]
  );
  const [isActive, setIsActive] = useState(editingItem?.isActive ?? true);
  const [order, setOrder] = useState(editingItem?.order ?? 0);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateItem = (index: number, field: keyof CategoryTileGridItem, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { ...DEFAULT_ITEM, order: prev.length }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    const url = await onUploadImage(file);
    if (url) updateItem(index, 'image', url);
    setUploadingIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(items, isActive, order);
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
            className="bg-white rounded-t-xl sm:rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Category Tile Grid' : 'Create Category Tile Grid'}
                </h2>
                <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ctg-order">Order</label>
                      <input
                        id="ctg-order"
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
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Tiles ({items.length})</h3>
                    <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-[#A68520] hover:text-[#8B6914]">
                      <Plus className="w-4 h-4" /> Add Tile
                    </button>
                  </div>

                  {items.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Tile {index + 1}</span>
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(index)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-600" htmlFor={`ctg-image-${index}`}>Image</label>
                          <input
                            id={`ctg-image-${index}`}
                            type="text"
                            value={item.image}
                            onChange={(e) => updateItem(index, 'image', e.target.value)}
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
                            className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#D4AF37] transition-colors"
                          >
                            {uploadingIndex === index ? (
                              <RotateCcw className="w-5 h-5 animate-spin text-gray-400" />
                            ) : item.image ? (
                              <div className="relative w-full h-full">
                                <Image src={item.image} alt="" fill className="object-contain rounded-lg" unoptimized />
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
                          <label className="block text-xs font-medium text-gray-600" htmlFor={`ctg-title-${index}`}>Title</label>
                          <input
                            id={`ctg-title-${index}`}
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItem(index, 'title', e.target.value)}
                            placeholder="e.g. Men"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                          />
                          <label className="block text-xs font-medium text-gray-600" htmlFor={`ctg-subtitle-${index}`}>Subtitle</label>
                          <input
                            id={`ctg-subtitle-${index}`}
                            type="text"
                            value={item.subtitle}
                            onChange={(e) => updateItem(index, 'subtitle', e.target.value)}
                            placeholder="e.g. Shop Now"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                          />
                          <label className="block text-xs font-medium text-gray-600" htmlFor={`ctg-link-${index}`}>Link</label>
                          <input
                            id={`ctg-link-${index}`}
                            type="text"
                            value={item.link}
                            onChange={(e) => updateItem(index, 'link', e.target.value)}
                            placeholder="/products/men"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                          />
                        </div>
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
