'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Link as LinkIcon, X } from 'lucide-react';
import type { FooterSectionLinkFormData } from '../types';

interface FooterSectionLinkModalProps {
  isOpen: boolean;
  linkForm: FooterSectionLinkFormData;
  editingLinkIndex: number | null;
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function FooterSectionLinkModal({
  isOpen,
  linkForm,
  editingLinkIndex,
  onFormChange,
  onSave,
  onClose,
}: FooterSectionLinkModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {editingLinkIndex !== null ? 'Edit Link' : 'Add Link'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {editingLinkIndex !== null
                        ? 'Update the link details'
                        : 'Add a new link to this section'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="linkName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Link Name *
                  </label>
                  <input
                    id="linkName"
                    type="text"
                    value={linkForm.name}
                    onChange={(e) => onFormChange('name', e.target.value)}
                    placeholder="e.g., About Us, Privacy Policy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-400"
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="linkHref"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    URL *
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="linkHref"
                      type="text"
                      value={linkForm.href}
                      onChange={(e) => onFormChange('href', e.target.value)}
                      placeholder="/about or https://example.com"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Internal: /about &middot; External: https://example.com
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingLinkIndex !== null ? 'Update Link' : 'Add Link'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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
