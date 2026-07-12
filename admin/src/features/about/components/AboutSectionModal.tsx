'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AboutSection, AboutSectionFormData } from '../types';
import { EMPTY_FORM } from '../types';

interface Props {
  isOpen: boolean;
  editingSection: AboutSection | null;
  onClose: () => void;
  onSave: (data: AboutSectionFormData) => void;
}

export function AboutSectionModal({ isOpen, editingSection, onClose, onSave }: Props) {
  const [form, setForm] = useState<AboutSectionFormData>(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) return;
    if (editingSection) {
      setForm({
        quote: editingSection.quote || '',
        ctaText: editingSection.ctaText || 'More About Us',
        ctaUrl: editingSection.ctaUrl || '/about',
        isActive: editingSection.isActive,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [isOpen]);

  const handleChange = (field: keyof AboutSectionFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.quote.trim()) return;
    onSave(form);
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
                {editingSection ? 'Edit About Section' : 'Add About Section'}
              </h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md" aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">Quote *</label>
                <textarea
                  id="quote"
                  value={form.quote}
                  onChange={(e) => handleChange('quote', e.target.value)}
                  placeholder="Enter the brand quote..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black resize-none"
                  required
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
                    placeholder="More About Us"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                  />
                </div>
                <div>
                  <label htmlFor="ctaUrl" className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
                  <input
                    id="ctaUrl"
                    type="text"
                    value={form.ctaUrl}
                    onChange={(e) => handleChange('ctaUrl', e.target.value)}
                    placeholder="/about"
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
