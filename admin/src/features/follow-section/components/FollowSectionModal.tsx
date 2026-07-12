'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import type { FollowSection } from '../types';
import { FollowSectionForm } from './FollowSectionForm';
import { FollowServiceList } from './FollowServiceList';
import { FollowSocialList } from './FollowSocialList';

type Tab = 'general' | 'services' | 'social';

interface FollowSectionModalProps {
  isOpen: boolean;
  isSaving: boolean;
  isUploading: boolean;
  editingItem: FollowSection | null;
  form: Partial<FollowSection>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (patch: Partial<FollowSection>) => void;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
  onUpdateService: (index: number, field: string, value: string | number | boolean) => void;
  onServiceImageUpload: (index: number, file: File) => void;
  onAddSocial: () => void;
  onRemoveSocial: (index: number) => void;
  onUpdateSocial: (index: number, field: string, value: string | number | boolean) => void;
  onToggleActive: (checked: boolean) => void;
}

export function FollowSectionModal({
  isOpen,
  isSaving,
  isUploading,
  editingItem,
  form,
  onClose,
  onSubmit,
  onFormChange,
  onAddService,
  onRemoveService,
  onUpdateService,
  onServiceImageUpload,
  onAddSocial,
  onRemoveSocial,
  onUpdateSocial,
  onToggleActive,
}: FollowSectionModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  return (
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
                <h2 className="text-xl font-bold text-gray-900 outer-sans">
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

              <div className="flex gap-2 mb-6 border-b border-gray-200">
                {(['general', 'services', 'social'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-[#A68520] border-b-2 border-[#D4AF37]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                {activeTab === 'general' && (
                  <FollowSectionForm form={form} onChange={onFormChange} />
                )}

                {activeTab === 'services' && (
                  <FollowServiceList
                    items={form.serviceItems || []}
                    isUploading={isUploading}
                    onAdd={onAddService}
                    onRemove={onRemoveService}
                    onUpdate={onUpdateService}
                    onImageUpload={onServiceImageUpload}
                  />
                )}

                {activeTab === 'social' && (
                  <FollowSocialList
                    links={form.socialLinks || []}
                    onAdd={onAddSocial}
                    onRemove={onRemoveSocial}
                    onUpdate={onUpdateSocial}
                  />
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                    Status
                  </h3>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={form.isActive ?? true}
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
