'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import type { DualCard, DualCardFormState, DualCardSection as DualCardSectionType } from '../types';

interface DualCardSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: DualCardFormState;
  onSubmit: (e: React.FormEvent) => void;
  editingSection: DualCardSectionType | null;
  isUploading: boolean;
  isSaving: boolean;
  onCardImageUpload: (cardIndex: number) => void;
  onUpdateCardField: (cardIndex: number, field: keyof DualCard, value: string) => void;
  onFormChange: (field: keyof DualCardFormState, value: DualCard[] | boolean) => void;
}

export function DualCardSectionModal({
  isOpen,
  onClose,
  form,
  onSubmit,
  editingSection,
  isUploading,
  isSaving,
  onCardImageUpload,
  onUpdateCardField,
  onFormChange,
}: DualCardSectionModalProps) {
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
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {editingSection ? 'Edit Section' : 'Add Section'}
              </h2>
              <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg" aria-label="Close modal">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-4">
              {form.cards.map((card, index) => (
                <div key={card.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Card {index + 1}</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
                    {card.src ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200">
                        <img src={card.src} alt={card.alt} className="w-full h-48 object-cover" />
                        <button
                          type="button"
                          onClick={() => onUpdateCardField(index, 'src', '')}
                          className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-lg hover:bg-black/70"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onCardImageUpload(index)}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                      <input
                        type="text"
                        value={card.label}
                        onChange={(e) => onUpdateCardField(index, 'label', e.target.value)}
                        placeholder="SS26 Dresses"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                      <input
                        type="text"
                        value={card.link}
                        onChange={(e) => onUpdateCardField(index, 'link', e.target.value)}
                        placeholder="/products"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={card.buttonText || ''}
                      onChange={(e) => onUpdateCardField(index, 'buttonText', e.target.value)}
                      placeholder="Explore Now"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => onFormChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingSection ? 'Update' : 'Create'}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
