'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { clientLogger } from '@/lib/logger';
import type { HeroSlide, HeroSlideForm } from '../types';

interface HeroSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: HeroSlideForm) => Promise<void>;
  editingItem: HeroSlide | null;
  isUploading: boolean;
  onUploadImage: (file: File) => Promise<string | null>;
}

export function HeroSlideModal({
  isOpen, onClose, onSubmit, editingItem, isUploading, onUploadImage,
}: HeroSlideModalProps) {
  const [form, setForm] = useState<HeroSlideForm>({
    title: '', subtitle: '', image: '', imageMobile: '', isActive: true, order: 0,
  });
  const [dragActive, setDragActive] = useState<'' | 'main' | 'mobile'>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setForm({
          title: editingItem.title,
          subtitle: editingItem.subtitle || '',
          image: editingItem.image,
          imageMobile: editingItem.imageMobile || '',
          isActive: editingItem.isActive,
          order: editingItem.order,
        });
      } else {
        setForm({ title: '', subtitle: '', image: '', imageMobile: '', isActive: true, order: 0 });
      }
    }
  }, [isOpen, editingItem]);

  const handleChange = (field: keyof HeroSlideForm, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try { await onSubmit(form); } finally { setIsSubmitting(false); }
  };

  const handleDrag = (e: React.DragEvent, field: 'main' | 'mobile') => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover' ? field : '');
  };

  const handleDrop = (e: React.DragEvent, field: 'main' | 'mobile') => {
    e.preventDefault(); e.stopPropagation(); setDragActive('');
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file, field);
  };

  const handleUploadClick = (field: 'main' | 'mobile') => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) handleUpload(file, field); };
    input.click();
  };

  const handleUpload = async (file: File, field: 'main' | 'mobile') => {
    const url = await onUploadImage(file);
    if (url) handleChange(field === 'main' ? 'image' : 'imageMobile', url);
  };

  const ImageArea = ({ field, label, value }: { field: 'main' | 'mobile'; label: string; value: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {isUploading ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <div className="text-sm text-gray-600">Uploading...</div>
          </div>
        </div>
      ) : value ? (
        <div className="relative">
          <img src={value} alt="Preview" className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-100" crossOrigin="anonymous"
            onError={(e) => { clientLogger.error('Failed to load image:', value); e.currentTarget.src = ''; }} />
          <button type="button" onClick={() => handleChange(field === 'main' ? 'image' : 'imageMobile', '')}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"><X className="w-4 h-4" /></button>
        </div>
      ) : (
        <div role="button" tabIndex={0}
          onDragEnter={(e) => handleDrag(e, field)} onDragLeave={(e) => handleDrag(e, field)}
          onDragOver={(e) => handleDrag(e, field)} onDrop={(e) => handleDrop(e, field)}
          onClick={() => handleUploadClick(field)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleUploadClick(field); }}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive === field ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-300 hover:border-[#D4AF37] bg-white'
          }`}>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><Upload className="w-6 h-6 text-gray-400" /></div>
            <div className="text-sm text-gray-600"><span className="font-medium text-[#D4AF37]">Click to upload</span> or drag and drop</div>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 sm:items-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-t-xl sm:rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-black">
                  {editingItem ? 'Edit Hero Slide' : 'Create Hero Slide'}
                </h2>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-black focus:ring-2 focus:ring-[#D4AF37] rounded-md"><X className="w-6 h-6" /></button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageArea field="main" label="Desktop Image *" value={form.image} />
                <ImageArea field="mobile" label="Mobile Image" value={form.imageMobile} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Status</h3>
                <div className="flex items-center">
                  <input type="checkbox" id="isActive" checked={form.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="mr-2 h-4 w-4 accent-[#D4AF37] border-gray-300 rounded" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (visible on website)</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                <button type="submit" disabled={isSubmitting}
                  className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] disabled:opacity-50 font-semibold">
                  {isSubmitting ? 'Saving...' : editingItem ? 'Update' : 'Create'} Slide
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
