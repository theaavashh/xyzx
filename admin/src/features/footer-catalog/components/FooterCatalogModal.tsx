'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Link as LinkIcon, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FooterCatalog, FooterCatalogForm, FooterCatalogLink } from '../types';
import { FooterCatalogLinkModal } from './FooterCatalogLinkModal';

interface FooterCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: FooterCatalogForm) => Promise<void>;
  editingItem: FooterCatalog | null;
}

export function FooterCatalogModal({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
}: FooterCatalogModalProps) {
  const [form, setForm] = useState<FooterCatalogForm>({
    title: '',
    href: '',
    order: 0,
    isActive: true,
    links: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setForm({
          title: editingItem.title,
          href: editingItem.href,
          order: editingItem.order,
          isActive: editingItem.isActive,
          links: editingItem.links,
        });
      } else {
        setForm({
          title: '',
          href: '',
          order: 0,
          isActive: true,
          links: [],
        });
      }
    }
  }, [isOpen, editingItem]);

  const handleFormChange = (
    field: keyof FooterCatalogForm,
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

  const openLinkModal = (index?: number) => {
    setEditingLinkIndex(index ?? null);
    setLinkModalOpen(true);
  };

  const handleLinkSave = (link: FooterCatalogLink) => {
    setForm((prev) => {
      const links = [...prev.links];
      if (editingLinkIndex !== null) {
        links[editingLinkIndex] = link;
      } else {
        links.push({ ...link, order: links.length });
      }
      return { ...prev, links };
    });
    setLinkModalOpen(false);
    setEditingLinkIndex(null);
  };

  const handleRemoveLink = (index: number) => {
    if (!confirm('Are you sure you want to remove this link?')) return;
    setForm((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const editingLink =
    editingLinkIndex !== null ? form.links[editingLinkIndex] : null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 sm:items-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-xl sm:rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingItem
                      ? 'Edit Footer Catalog'
                      : 'Create Footer Catalog'}
                  </h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Title *
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={form.title}
                          onChange={(e) =>
                            handleFormChange('title', e.target.value)
                          }
                          placeholder="e.g., Featured, Shoes, Clothing"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="href"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Section URL
                        </label>
                        <input
                          id="href"
                          type="text"
                          value={form.href}
                          onChange={(e) =>
                            handleFormChange('href', e.target.value)
                          }
                          placeholder="e.g., /featured, /shoes"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Links
                      </h3>
                      <button
                        type="button"
                        onClick={() => openLinkModal()}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                        Add Link
                      </button>
                    </div>

                    <div className="space-y-3">
                      {form.links.map((link, linkIndex) => (
                        <div
                          key={linkIndex}
                          className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {link.label}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {link.href}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openLinkModal(linkIndex)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(linkIndex)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {form.links.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No links added yet</p>
                        <button
                          type="button"
                          onClick={() => openLinkModal()}
                          className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Add your first link
                        </button>
                      </div>
                    )}
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
                        onChange={(e) =>
                          handleFormChange('isActive', e.target.checked)
                        }
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-medium text-gray-700"
                      >
                        Active (visible in footer)
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </span>
                      ) : editingItem ? (
                        'Update'
                      ) : (
                        'Create'
                      )}{' '}
                      Category Section
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

      <FooterCatalogLinkModal
        isOpen={linkModalOpen}
        onClose={() => {
          setLinkModalOpen(false);
          setEditingLinkIndex(null);
        }}
        onSave={handleLinkSave}
        editingLink={editingLink}
      />
    </>
  );
}
