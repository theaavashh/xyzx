'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Link as LinkIcon, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { clientLogger } from '@/lib/logger';
import type { ImageGridItem, ImageGridForm } from '../types';

interface ImageGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: ImageGridForm) => Promise<void>;
  editingItem: ImageGridItem | null;
  isUploading: boolean;
  onUploadImage: (file: File) => Promise<string | null>;
}

export function ImageGridModal({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  isUploading,
  onUploadImage,
}: ImageGridModalProps) {
  const [form, setForm] = useState<ImageGridForm>({
    src: '',
    title: '',
    subtitle: '',
    link: '',
    isActive: true,
    order: 0,
  });
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setForm({
          src: editingItem.src,
          title: editingItem.title || '',
          subtitle: editingItem.subtitle || '',
          link: editingItem.link || '',
          isActive: editingItem.isActive,
          order: editingItem.order,
        });
      } else {
        setForm({
          src: '',
          title: '',
          subtitle: '',
          link: '',
          isActive: true,
          order: 0,
        });
      }
    }
  }, [isOpen, editingItem]);

  const handleFormChange = (
    field: keyof ImageGridForm,
    value: string | number | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImageUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) handleImageUpload(file);
    };
    input.click();
  };

  const handleImageUpload = async (file: File) => {
    const url = await onUploadImage(file);
    if (url) {
      handleFormChange('src', url);
    }
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
            className="bg-white rounded-t-xl sm:rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-black">
                  {editingItem ? 'Edit Image Grid Item' : 'Create Image Grid Item'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div>
                <label htmlFor="src" className="block text-sm font-medium text-gray-700 mb-1">
                  Image *
                </label>
                {isUploading ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                      <div className="text-sm text-gray-600">Uploading...</div>
                    </div>
                  </div>
                ) : form.src ? (
                  <div className="relative">
                    <img
                      src={form.src}
                      alt="Preview"
                      className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-100"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        clientLogger.error('Failed to load image:', form.src);
                        e.currentTarget.src = '';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleFormChange('src', '')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleImageUploadClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleImageUploadClick();
                    }}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      dragActive
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-gray-300 hover:border-[#D4AF37] bg-white'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-[#D4AF37]">Click to upload</span> or drag and drop
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="e.g., New Arrivals"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black placeholder:text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <input
                  id="subtitle"
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => handleFormChange('subtitle', e.target.value)}
                  placeholder="e.g., Discover the latest styles"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black placeholder:text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="link"
                    type="text"
                    value={form.link}
                    onChange={(e) => handleFormChange('link', e.target.value)}
                    placeholder="/products or https://example.com"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Status
                </h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => handleFormChange('isActive', e.target.checked)}
                    className="mr-2 h-4 w-4 accent-[#D4AF37] checked:bg-[#D4AF37] checked:border-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active (visible on website)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-semibold"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Update' : 'Create'} Item
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
