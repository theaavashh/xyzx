'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import type { FollowSectionFormState } from '../types';
import { FollowSectionForm } from './FollowSectionForm';

interface FollowSectionModalProps {
  isOpen: boolean;
  isSaving: boolean;
  editingItem: { id: string } | null;
  form: FollowSectionFormState;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (patch: Partial<FollowSectionFormState>) => void;
  onToggleActive: (checked: boolean) => void;
}

export function FollowSectionModal({
  isOpen,
  isSaving,
  editingItem,
  form,
  onClose,
  onSubmit,
  onFormChange,
  onToggleActive,
}: FollowSectionModalProps) {
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
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Follow Section' : 'Create Follow Section'}
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
                <FollowSectionForm form={form} onChange={onFormChange} />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                    Status
                  </h3>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={form.isActive}
                      onChange={(e) => onToggleActive(e.target.checked)}
                      className="mr-2 h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Active (visible on website)
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-[#D4AF37] text-white px-4 py-2.5 rounded-lg hover:bg-[#C4A030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center gap-2">
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        Saving...
                      </span>
                    ) : editingItem ? (
                      'Update'
                    ) : (
                      'Create'
                    )}{' '}
                    Follow Section
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
