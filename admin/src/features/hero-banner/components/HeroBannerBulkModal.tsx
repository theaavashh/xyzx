'use client';

import { useEffect, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Copy,
  GripVertical,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';
import type { HeroBanner } from '../types';
import { INTERNAL_LINKS } from '../types';
import type { BannerFormEntry } from '../types';

interface HeroBannerBulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEntries: BannerFormEntry[];
  onUploadImage: (file: File, entryId: string, type: 'large' | 'small') => Promise<string | null>;
  onSubmit: (entries: BannerFormEntry[]) => void;
  isSubmitting: boolean;
  editingBanner: HeroBanner | null;
}

function pickFile(entryId: string, type: 'large' | 'small', onPick: (file: File) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,video/*';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) onPick(file);
  };
  input.click();
}

function pickVideoFile(onPick: (file: File) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) onPick(file);
  };
  input.click();
}

let entryCounter = 0;

function createNewEntry(order: number): BannerFormEntry {
  entryCounter++;
  return {
    id: `entry-${entryCounter}`,
    title: '', subtitle: '', largeImage: '', smallImage: '',
    videoUrl: '', buttonUrl: '', buttonText: '', isActive: true, order,
    position: 'CENTER',
    largePreview: '', smallPreview: '',
    isUploadingLarge: false, isUploadingSmall: false,
  };
}

export function HeroBannerBulkModal({
  isOpen,
  onClose,
  initialEntries,
  onUploadImage,
  onSubmit,
  isSubmitting,
  editingBanner,
}: HeroBannerBulkModalProps) {
  const { control, register, handleSubmit, watch, setValue, getValues, reset, trigger, formState: { errors } } = useForm<{ entries: BannerFormEntry[] }>({
    defaultValues: { entries: initialEntries },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'entries' });
  const watchedEntries = watch('entries');
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      reset({ entries: initialEntries });
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, initialEntries, reset]);

  const handleAddEntry = () => {
    const current = getValues('entries');
    append(createNewEntry(current.length));
  };

  const handleDuplicateEntry = (index: number) => {
    const current = getValues('entries');
    const src = current[index];
    const copy = createNewEntry(current.length);
    Object.assign(copy, {
      title: src.title, subtitle: src.subtitle,
      largeImage: src.largeImage, smallImage: src.smallImage,
      videoUrl: src.videoUrl, buttonUrl: src.buttonUrl,
      buttonText: src.buttonText, isActive: src.isActive,
      largePreview: src.largePreview, smallPreview: src.smallPreview,
    });
    append(copy);
  };

  const handleRemoveEntry = (index: number) => {
    const current = getValues('entries');
    if (current.length > 1) remove(index);
  };

  const handleUpload = async (index: number, type: 'large' | 'small', file: File) => {
    const entry = getValues('entries')[index];
    const isVideo = file.type.startsWith('video/');
    const uField = type === 'large' ? 'isUploadingLarge' : 'isUploadingSmall';
    setValue(`entries.${index}.${uField}`, true);
    try {
      const url = await onUploadImage(file, entry.id, type);
      if (url) {
        if (isVideo) {
          setValue(`entries.${index}.videoUrl`, url);
        } else {
          setValue(`entries.${index}.${type === 'large' ? 'largeImage' : 'smallImage'}`, url);
        }
        setValue(`entries.${index}.${type === 'large' ? 'largePreview' : 'smallPreview'}`, url);
        trigger(`entries.${index}.videoUrl`);
        if (type === 'large') trigger(`entries.${index}.title`);
      }
    } catch {
      // error toast handled by parent
    } finally {
      setValue(`entries.${index}.${uField}`, false);
    }
  };

  const handleVideoUpload = async (index: number, file: File) => {
    const entry = getValues('entries')[index];
    setValue(`entries.${index}.isUploadingLarge`, true);
    try {
      const url = await onUploadImage(file, entry.id, 'large');
      if (url) {
        setValue(`entries.${index}.videoUrl`, url);
        setValue(`entries.${index}.largePreview`, url);
        trigger(`entries.${index}.videoUrl`);
      }
    } catch {
      // error toast handled by parent
    } finally {
      setValue(`entries.${index}.isUploadingLarge`, false);
    }
  };

  const handleRemoveImage = (index: number, type: 'large' | 'small') => {
    setValue(`entries.${index}.${type === 'large' ? 'largeImage' : 'smallImage'}`, '');
    setValue(`entries.${index}.${type === 'large' ? 'largePreview' : 'smallPreview'}`, '');
    trigger(`entries.${index}.videoUrl`);
    if (type === 'large') trigger(`entries.${index}.title`);
  };

  const onValid = (data: { entries: BannerFormEntry[] }) => {
    onSubmit(data.entries.filter((e) => e.largeImage || e.videoUrl));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
                <h2 className="text-2xl font-semibold text-black">
                  {editingBanner ? 'Edit Banner' : 'Add Banners'}
                </h2>
                <p className="text-sm text-gray-500">
                  {fields.length} entr{fields.length === 1 ? 'y' : 'ies'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddEntry}
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
            <form
              id="hero-banner-form"
              onSubmit={handleSubmit(onValid)}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {fields.map((field, i) => {
                const entry = watchedEntries[i];
                return (
                  <div
                    key={field.id}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-sm font-medium text-gray-900">
                          #{i + 1}
                        </span>
                        {!entry?.isActive && (
                          <span className="text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                            HIDDEN
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateEntry(i)}
                          className="p-1 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEntry(i)}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Title
                        </label>
                        <input
                          type="text"
                          {...register(`entries.${i}.title`)}
                          placeholder="Banner title"
                            className={`w-full px-2.5 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black placeholder:text-gray-400 ${errors.entries?.[i]?.title ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {errors.entries?.[i]?.title && (
                            <p className="mt-1 text-xs text-red-500">{errors.entries[i]?.title?.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            {...register(`entries.${i}.subtitle`)}
                            placeholder="Subtitle"
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Desktop {!entry?.videoUrl && <span className="text-red-500">*</span>}
                          </label>
                          {entry?.largePreview ? (
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
                                onClick={() => handleRemoveImage(i, 'large')}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => pickFile(field.id, 'large', (file) => handleUpload(i, 'large', file))}
                              disabled={entry?.isUploadingLarge}
                              className="w-full h-40 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-[#D4AF37] hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              {entry?.isUploadingLarge ? (
                                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs text-gray-400">Upload</span>
                                </>
                              )}
                            </button>
                          )}
                          {errors.entries?.[i]?.largeImage && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.entries[i]?.largeImage?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Mobile
                          </label>
                          {entry?.smallPreview ? (
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
                                onClick={() => handleRemoveImage(i, 'small')}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => pickFile(field.id, 'small', (file) => handleUpload(i, 'small', file))}
                              disabled={entry?.isUploadingSmall}
                              className="w-full h-40 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-[#D4AF37] hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              {entry?.isUploadingSmall ? (
                                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs text-gray-400">Upload</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Video URL <span className="text-gray-400">(optional)</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            {...register(`entries.${i}.videoUrl`, {
                              validate: (value) => {
                                const largeImage = getValues(`entries.${i}.largeImage`);
                                return (value || largeImage) ? true : 'Upload an image or enter a video URL';
                              },
                            })}
                            placeholder="https://... or upload a video"
                            className={`flex-1 px-2.5 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black placeholder:text-gray-400 ${errors.entries?.[i]?.videoUrl ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          <button
                            type="button"
                            onClick={() => pickVideoFile((file) => handleVideoUpload(i, file))}
                            disabled={entry?.isUploadingLarge}
                            className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:border-[#D4AF37] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Upload
                          </button>
                        </div>
                        {errors.entries?.[i]?.videoUrl && (
                          <p className="mt-1 text-xs text-red-500">{errors.entries[i]?.videoUrl?.message}</p>
                        )}
                        {entry?.videoUrl && (
                          <div className="mt-2 relative group">
                            <video
                              src={entry.videoUrl}
                              className="w-full h-32 object-contain rounded-lg border border-gray-200 bg-gray-50"
                              muted
                            />
                            <button
                              type="button"
                              onClick={() => { setValue(`entries.${i}.videoUrl`, ''); setValue(`entries.${i}.largePreview`, entry.largeImage || ''); trigger(`entries.${i}.videoUrl`); }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Button Text
                          </label>
                          <input
                            type="text"
                            {...register(`entries.${i}.buttonText`)}
                            placeholder="Shop Now"
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Link
                          </label>
                          <select
                            {...register(`entries.${i}.buttonUrl`)}
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black bg-white"
                          >
                            <option value="">Select</option>
                            {INTERNAL_LINKS.map((l) => (
                              <option key={l.value} value={l.value}>
                                {l.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Content Position
                        </label>
                        <select
                          {...register(`entries.${i}.position`)}
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-black bg-white"
                        >
                          <option value="TOP_LEFT">Top Left</option>
                          <option value="TOP_RIGHT">Top Right</option>
                          <option value="BOTTOM_LEFT">Bottom Left</option>
                          <option value="BOTTOM_RIGHT">Bottom Right</option>
                          <option value="CENTER">Center</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div
                          className={`relative w-9 h-4.5 rounded-full transition-colors ${
                            entry?.isActive ? 'bg-[#D4AF37]' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${
                              entry?.isActive ? 'translate-x-4.5' : ''
                            }`}
                          />
                          <input
                            type="checkbox"
                            checked={entry?.isActive ?? true}
                            onChange={(e) => setValue(`entries.${i}.isActive`, e.target.checked)}
                            className="sr-only"
                          />
                        </div>
                        <span className="text-xs text-gray-600">Active</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </form>
            <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="hero-banner-form"
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black"
              >
                {isSubmitting
                  ? 'Saving...'
                  : `Save (${watchedEntries?.filter((e) => e.largeImage || e.videoUrl).length ?? 0})`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
