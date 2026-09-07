'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Link as LinkIcon, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import type { FooterSection } from '../types';

interface FooterSectionModalProps {
  isOpen: boolean;
  editingSection: FooterSection | null;
  sectionForm: Partial<FooterSection>;
  isSaving: boolean;
  onFormChange: (field: string, value: string | boolean | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onAddLink: () => void;
  onEditLink: (index: number) => void;
  onRemoveLink: (index: number) => void;
}

export function FooterSectionModal({
  isOpen,
  editingSection,
  sectionForm,
  isSaving,
  onFormChange,
  onSubmit,
  onClose,
  onAddLink,
  onEditLink,
  onRemoveLink,
}: FooterSectionModalProps) {
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
            className="bg-white rounded-t-xl sm:rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingSection
                    ? 'Edit Footer Section'
                    : 'Create Footer Section'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Basic Information
                  </h3>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Section Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={sectionForm.title || ''}
                      onChange={(e) =>
                        onFormChange('title', e.target.value)
                      }
                      placeholder="e.g., Company, Help, Policies, Quick Links"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Links
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {(sectionForm.links || []).length} link{(sectionForm.links || []).length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onAddLink}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Link
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(sectionForm.links || []).map((link, linkIndex) => (
                      <div
                        key={linkIndex}
                        className="bg-white px-4 py-3 rounded-lg border border-gray-200 flex items-center gap-3"
                      >
                        <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {link.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {link.href}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onEditLink(linkIndex)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveLink(linkIndex)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {(sectionForm.links || []).length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <LinkIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No links yet</p>
                      <button
                        type="button"
                        onClick={onAddLink}
                        className="mt-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
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
                      checked={sectionForm.isActive}
                      onChange={(e) =>
                        onFormChange('isActive', e.target.checked)
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
                    disabled={isSaving}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        Saving...
                      </span>
                    ) : editingSection ? (
                      'Update'
                    ) : (
                      'Create'
                    )}{' '}
                    Section
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
