'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Image as ImageIcon, Video, MapPin, Search, Quote, Layout, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { uploadFile as uploadFileToApi } from '@/services/apiClient';
import type { AboutSection, AboutSectionFormData } from '../types';
import { EMPTY_FORM } from '../types';

interface Props {
  isOpen: boolean;
  editingSection: AboutSection | null;
  onClose: () => void;
  onSave: (data: AboutSectionFormData) => void;
}

type Tab = 'hero' | 'story' | 'quote' | 'video' | 'banner' | 'store' | 'seo';

const TABS: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: 'hero', label: 'Hero', icon: ImageIcon },
  { id: 'story', label: 'Story', icon: Layout },
  { id: 'quote', label: 'Quote & CTA', icon: Quote },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'banner', label: 'Banner', icon: ImageIcon },
  { id: 'store', label: 'Store Info', icon: MapPin },
  { id: 'seo', label: 'SEO', icon: Search },
];

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black text-sm';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const textareaCls = `${inputCls} resize-none`;

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function MediaField({
  label,
  value,
  accept,
  uploading,
  onUpload,
  onClear,
}: {
  label: string;
  value?: string;
  accept: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {value ? (
        <div className="flex items-center gap-3">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
            {accept.startsWith('video') ? (
              <video src={value} className="w-full h-full object-contain" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="w-full h-full object-contain" />
            )}
            <button
              type="button"
              onClick={onClear}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <label className="cursor-pointer text-xs text-[#D4AF37] hover:underline">
            Replace
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.target.value = '';
              }}
            />
          </label>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#D4AF37] transition-colors">
          <Upload className="w-6 h-6 text-gray-400" />
          <span className="text-xs text-gray-500">
            {uploading ? 'Uploading…' : 'Click to upload'}
          </span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = '';
            }}
          />
        </label>
      )}
    </div>
  );
}

export function AboutSectionModal({ isOpen, editingSection, onClose, onSave }: Props) {
  const [form, setForm] = useState<AboutSectionFormData>(EMPTY_FORM);
  const [tab, setTab] = useState<Tab>('hero');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingSection) {
      setForm({ ...EMPTY_FORM, ...editingSection });
    } else {
      setForm(EMPTY_FORM);
    }
    setTab('hero');
    setErrors({});
  }, [isOpen, editingSection]);

  const handleChange = (field: keyof AboutSectionFormData, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  };

  const uploadFile = async (field: keyof AboutSectionFormData, file: File) => {
    setUploadingField(field as string);
    try {
      const data = await uploadFileToApi<{ data?: { url: string }; message?: string }>(
        '/api/v1/upload/file',
        file,
      );
      const url = data?.data?.url;
      if (url) {
        handleChange(field, url);
      } else {
        toast.error(data?.message || 'Upload failed: no URL returned');
      }
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploadingField(null);
    }
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.quote.trim()) e.quote = 'Quote is required';
    if (form.storeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.storeEmail)) {
      e.storeEmail = 'Enter a valid email address';
    }
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      if (e.quote) setTab('quote');
      else if (e.storeEmail) setTab('store');
      return;
    }
    onSave(form);
  };

  const errBorder = (f: string) => (errors[f] ? 'border-red-400' : '');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-black">
                {editingSection ? 'Edit About Page' : 'Add About Page'}
              </h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto border-b border-gray-100 bg-gray-50">
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                      tab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Hero Tab */}
              {tab === 'hero' && (
                <>
                  <MediaField
                    label="Hero Background Image"
                    value={form.heroImage || ''}
                    accept="image/*"
                    uploading={uploadingField === 'heroImage'}
                    onUpload={(f) => uploadFile('heroImage', f)}
                    onClear={() => handleChange('heroImage', '')}
                  />
                  <Field label="Hero Subtitle">
                    <input type="text" value={form.heroSubtitle || ''} onChange={(e) => handleChange('heroSubtitle', e.target.value)} placeholder="Premium fashion and footwear..." className={inputCls} />
                  </Field>
                  <Field label="Hero Tagline (italic text)">
                    <input type="text" value={form.heroTagline || ''} onChange={(e) => handleChange('heroTagline', e.target.value)} placeholder="Est. for the ones who dress with intent" className={inputCls} />
                  </Field>
                </>
              )}

              {/* Story Tab */}
              {tab === 'story' && (
                <>
                  <Field label="Story Title">
                    <input type="text" value={form.storyTitle || ''} onChange={(e) => handleChange('storyTitle', e.target.value)} placeholder="Founded with a vision for quality that lasts" className={inputCls} />
                  </Field>
                  <Field label="Story Content (HTML supported)">
                    <textarea value={form.storyContent || ''} onChange={(e) => handleChange('storyContent', e.target.value)} rows={6} placeholder="<p>Your story here...</p>" className={textareaCls} />
                  </Field>
                  <MediaField
                    label="Story Image"
                    value={form.storyImage || ''}
                    accept="image/*"
                    uploading={uploadingField === 'storyImage'}
                    onUpload={(f) => uploadFile('storyImage', f)}
                    onClear={() => handleChange('storyImage', '')}
                  />
                </>
              )}

              {/* Quote & CTA Tab */}
              {tab === 'quote' && (
                <>
                  <Field label="Homepage Quote" required error={errors.quote}>
                    <textarea value={form.quote} onChange={(e) => handleChange('quote', e.target.value)} rows={3} placeholder="Style is a way to say who you are..." className={`${textareaCls} ${errBorder('quote')}`} />
                  </Field>
                  <Field label="About Page Pull Quote">
                    <textarea value={form.pullQuote || ''} onChange={(e) => handleChange('pullQuote', e.target.value)} rows={3} placeholder="Style is a way to say who you are without having to speak." className={textareaCls} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="CTA Button Text">
                      <input type="text" value={form.ctaText} onChange={(e) => handleChange('ctaText', e.target.value)} placeholder="More About Us" className={inputCls} />
                    </Field>
                    <Field label="CTA Button URL">
                      <input type="text" value={form.ctaUrl} onChange={(e) => handleChange('ctaUrl', e.target.value)} placeholder="/about" className={inputCls} />
                    </Field>
                  </div>
                </>
              )}

              {/* Video Tab */}
              {tab === 'video' && (
                <>
                  <MediaField
                    label="Video File"
                    value={form.videoUrl || ''}
                    accept="video/*"
                    uploading={uploadingField === 'videoUrl'}
                    onUpload={(f) => uploadFile('videoUrl', f)}
                    onClear={() => handleChange('videoUrl', '')}
                  />
                  <Field label="Video Overlay Text">
                    <input type="text" value={form.videoOverlayText || ''} onChange={(e) => handleChange('videoOverlayText', e.target.value)} placeholder="Feel the craft" className={inputCls} />
                  </Field>
                </>
              )}

              {/* Banner Tab */}
              {tab === 'banner' && (
                <>
                  <MediaField
                    label="Banner Image"
                    value={form.bannerImage || ''}
                    accept="image/*"
                    uploading={uploadingField === 'bannerImage'}
                    onUpload={(f) => uploadFile('bannerImage', f)}
                    onClear={() => handleChange('bannerImage', '')}
                  />
                  <Field label="Banner Overlay Text">
                    <input type="text" value={form.bannerText || ''} onChange={(e) => handleChange('bannerText', e.target.value)} placeholder="Dressed to be remembered" className={inputCls} />
                  </Field>
                </>
              )}

              {/* Store Tab */}
              {tab === 'store' && (
                <>
                  <Field label="Store Description">
                    <textarea value={form.storeDescription || ''} onChange={(e) => handleChange('storeDescription', e.target.value)} rows={2} placeholder="Come visit us at our flagship store..." className={textareaCls} />
                  </Field>
                  <Field label="Address">
                    <input type="text" value={form.storeAddress || ''} onChange={(e) => handleChange('storeAddress', e.target.value)} placeholder="123 Fashion Avenue" className={inputCls} />
                  </Field>
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="City">
                      <input type="text" value={form.storeCity || ''} onChange={(e) => handleChange('storeCity', e.target.value)} placeholder="New York" className={inputCls} />
                    </Field>
                    <Field label="State">
                      <input type="text" value={form.storeState || ''} onChange={(e) => handleChange('storeState', e.target.value)} placeholder="NY" className={inputCls} />
                    </Field>
                    <Field label="Zip">
                      <input type="text" value={form.storeZip || ''} onChange={(e) => handleChange('storeZip', e.target.value)} placeholder="10001" className={inputCls} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Phone">
                      <input type="text" value={form.storePhone || ''} onChange={(e) => handleChange('storePhone', e.target.value)} placeholder="+1 (212) 555-0189" className={inputCls} />
                    </Field>
                    <Field label="Email" error={errors.storeEmail}>
                      <input type="email" value={form.storeEmail || ''} onChange={(e) => handleChange('storeEmail', e.target.value)} placeholder="support@rapharch.com" className={`${inputCls} ${errBorder('storeEmail')}`} />
                    </Field>
                  </div>
                </>
              )}

              {/* SEO Tab */}
              {tab === 'seo' && (
                <>
                  <Field label="Meta Title">
                    <input type="text" value={form.metaTitle || ''} onChange={(e) => handleChange('metaTitle', e.target.value)} placeholder="About RaphArch" className={inputCls} />
                  </Field>
                  <Field label="Meta Description">
                    <textarea value={form.metaDescription || ''} onChange={(e) => handleChange('metaDescription', e.target.value)} rows={2} placeholder="Learn about RaphArch..." className={textareaCls} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Order">
                      <input type="number" value={form.order} onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)} className={inputCls} />
                    </Field>
                    <div className="flex items-center gap-2 pt-6">
                      <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} className="h-4 w-4 accent-[#D4AF37] rounded" />
                      <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                    </div>
                  </div>
                </>
              )}
            </form>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
              <button type="submit" onClick={handleSubmit} className="px-4 py-2 text-sm bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] font-semibold">
                {editingSection ? 'Update' : 'Create'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
