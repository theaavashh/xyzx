'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FooterCatalogLink } from '../types';

interface FooterCatalogLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: FooterCatalogLink) => void;
  editingLink: FooterCatalogLink | null;
}

export function FooterCatalogLinkModal({
  isOpen,
  onClose,
  onSave,
  editingLink,
}: FooterCatalogLinkModalProps) {
  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLabel(editingLink?.label ?? '');
      setHref(editingLink?.href ?? '');
    }
  }, [isOpen, editingLink]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onSave({
      ...(editingLink?.id ? { id: editingLink.id } : {}),
      label: label.trim(),
      href: href.trim(),
      order: editingLink?.order ?? 0,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60] sm:items-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-t-xl sm:rounded-xl shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingLink ? 'Edit Link' : 'Add Link'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="linkLabel"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Label *
                  </label>
                  <input
                    id="linkLabel"
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g., Air Force 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-400"
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
                  <input
                    id="linkHref"
                    type="text"
                    value={href}
                    onChange={(e) => setHref(e.target.value)}
                    placeholder="e.g., /products/air-force-1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingLink ? 'Update' : 'Add'} Link
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
