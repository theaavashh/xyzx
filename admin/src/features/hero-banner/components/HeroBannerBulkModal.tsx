'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Copy,
  GripVertical,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { BannerFormEntry, HeroBanner } from '../types';
import { INTERNAL_LINKS } from '../types';

interface HeroBannerBulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: BannerFormEntry[];
  onUpdateEntry: (id: string, field: keyof BannerFormEntry, value: unknown) => void;
  onUploadImage: (file: File, entryId: string, type: 'large' | 'small') => Promise<void>;
  onRemoveImage: (entryId: string, type: 'large' | 'small') => void;
  onAddEntry: () => void;
  onDuplicateEntry: (id: string) => void;
  onRemoveEntry: (id: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  editingBanner: HeroBanner | null;
}

function pickFile(entryId: string, type: 'large' | 'small', onUploadImage: HeroBannerBulkModalProps['onUploadImage']) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) onUploadImage(file, entryId, type);
  };
  input.click();
}

export function HeroBannerBulkModal({
  isOpen,
  onClose,
  entries,
  onUpdateEntry,
  onUploadImage,
  onRemoveImage,
  onAddEntry,
  onDuplicateEntry,
  onRemoveEntry,
  onSubmit,
  isSubmitting,
  editingBanner,
}: HeroBannerBulkModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-2xl font-semibold text-black lastik">
                  {editingBanner ? 'Edit Banner' : 'Add Banners'}
                </h2>
                <p className="text-sm text-gray-500">
                  {entries.length} entr{entries.length === 1 ? 'y' : 'ies'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onAddEntry}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-md hover:bg-[#D4AF37]/20 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {entries.map((entry, i) => (
                <div
                  key={entry.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-sm font-medium text-gray-900">
                        #{i + 1}
                      </span>
                      {!entry.isActive && (
                        <span className="text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => onDuplicateEntry(entry.id)}
                        className="p-1 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {entries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveEntry(entry.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={entry.title}
                          onChange={(e) =>
                            onUpdateEntry(entry.id, 'title', e.target.value)
                          }
                          placeholder="Banner title"
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={entry.subtitle}
                          onChange={(e) =>
                            onUpdateEntry(entry.id, 'subtitle', e.target.value)
                          }
                          placeholder="Subtitle"
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Desktop
                        </label>
                        {entry.largePreview ? (
                          <div className="relative group">
                            <img
                              src={entry.largePreview}
                              alt=""
                              className="w-full h-40 object-contain rounded-lg border border-gray-200 bg-gray-50"
                              crossOrigin="anonymous"
                            />
                            {entry.isUploadingLarge && (
                              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => onRemoveImage(entry.id, 'large')}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => pickFile(entry.id, 'large', onUploadImage)}
                            disabled={entry.isUploadingLarge}
                            className="w-full h-40 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-[#D4AF37] hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            {entry.isUploadingLarge ? (
                              <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  Upload
                                </span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Mobile
                        </label>
                        {entry.smallPreview ? (
                          <div className="relative group">
                            <img
                              src={entry.smallPreview}
                              alt=""
                              className="w-full h-40 object-contain rounded-lg border border-gray-200 bg-gray-50"
                              crossOrigin="anonymous"
                            />
                            {entry.isUploadingSmall && (
                              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => onRemoveImage(entry.id, 'small')}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => pickFile(entry.id, 'small', onUploadImage)}
                            disabled={entry.isUploadingSmall}
                            className="w-full h-40 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-[#D4AF37] hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            {entry.isUploadingSmall ? (
                              <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  Upload
                                </span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={entry.buttonText}
                          onChange={(e) =>
                            onUpdateEntry(entry.id, 'buttonText', e.target.value)
                          }
                          placeholder="Shop Now"
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Link
                        </label>
                        <select
                          value={
                            entry.buttonUrl &&
                            !INTERNAL_LINKS.find(
                              (o) => o.value === entry.buttonUrl,
                            )
                              ? 'custom'
                              : entry.buttonUrl || ''
                          }
                          onChange={(e) => {
                            const v = e.target.value;
                            onUpdateEntry(
                              entry.id,
                              'buttonUrl',
                              v === 'custom' ? '' : v,
                            );
                          }}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black bg-white"
                        >
                          <option value="">Select</option>
                          {INTERNAL_LINKS.map((l) => (
                            <option key={l.value} value={l.value}>
                              {l.label}
                            </option>
                          ))}
                        </select>
                        {entry.buttonUrl &&
                          !INTERNAL_LINKS.find(
                            (o) => o.value === entry.buttonUrl,
                          ) && (
                            <input
                              type="text"
                              value={entry.buttonUrl}
                              onChange={(e) =>
                                onUpdateEntry(
                                  entry.id,
                                  'buttonUrl',
                                  e.target.value,
                                )
                              }
                              placeholder="/custom-url"
                              className="w-full mt-1.5 px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black placeholder:text-gray-400"
                            />
                          )}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        className={`relative w-9 h-4.5 rounded-full transition-colors ${
                          entry.isActive ? 'bg-[#D4AF37]' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${
                            entry.isActive ? 'translate-x-4.5' : ''
                          }`}
                        />
                        <input
                          type="checkbox"
                          checked={entry.isActive}
                          onChange={(e) =>
                            onUpdateEntry(
                              entry.id,
                              'isActive',
                              e.target.checked,
                            )
                          }
                          className="sr-only"
                        />
                      </div>
                      <span className="text-xs text-gray-600">Active</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {isSubmitting
                  ? 'Saving...'
                  : `Save (${entries.filter((e) => e.title.trim()).length})`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
