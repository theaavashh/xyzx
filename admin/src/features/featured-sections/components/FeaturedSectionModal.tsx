'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FeaturedSection, FeaturedSectionFormData } from '../types';
import { EMPTY_FORM } from '../types';

interface Props {
  isOpen: boolean;
  editingSection: FeaturedSection | null;
  isUploading: boolean;
  onClose: () => void;
  onSave: (data: FeaturedSectionFormData) => void;
  onUploadImage: () => Promise<string | null>;
}

export function FeaturedSectionModal({
  isOpen,
  editingSection,
  isUploading,
  onClose,
  onSave,
  onUploadImage,
}: Props) {
  const [form, setForm] = useState<FeaturedSectionFormData>(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) return;
    if (editingSection) {
      setForm({
        title: editingSection.title || '',
        subtitle: editingSection.subtitle || '',
        description: editingSection.description || '',
        image: editingSection.image || '',
        ctaUrl: editingSection.ctaUrl || '',
        ctaText: editingSection.ctaText || '',
        isActive: editingSection.isActive,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [isOpen]);

  const handleChange = (field: keyof FeaturedSectionFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const handleUpload = async () => {
    const url = await onUploadImage();
    if (url) handleChange('image', url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-black outer-sans">
                {editingSection ? 'Edit Section' : 'Add Section'}
              </h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md" aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
                <div className="space-y-2">
                  {form.image ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img src={form.image} alt="Preview" className="w-full h-48 object-cover" />
                      <button
                        type="button"
                        onClick={() => handleChange('image', '')}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-lg hover:bg-black/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUpload}
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="New Collection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                />
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  id="subtitle"
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="Summer 2026"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Discover the latest styles"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    id="ctaText"
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => handleChange('ctaText', e.target.value)}
                    placeholder="Shop Now"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                  />
                </div>
                <div>
                  <label htmlFor="ctaUrl" className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                  <input
                    id="ctaUrl"
                    type="url"
                    value={form.ctaUrl}
                    onChange={(e) => handleChange('ctaUrl', e.target.value)}
                    placeholder="/shop"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="h-4 w-4 accent-[#D4AF37] checked:bg-[#D4AF37] checked:border-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
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
                  className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-semibold"
                >
                  {editingSection ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
