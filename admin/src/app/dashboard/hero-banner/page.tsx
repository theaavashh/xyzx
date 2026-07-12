'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/apiClient';
import { clientLogger } from '@/lib/logger';
import {
  useHeroBanners,
  useDeleteHeroBanner,
  useToggleHeroBanner,
  useReorderHeroBanners,
  useUploadHeroBannerImage,
  HeroBannerGrid,
  HeroBannerBulkModal,
  HeroBannerDeleteAlert,
  createEntry,
} from '@/features/hero-banner';
import type { HeroBanner, BannerFormEntry } from '@/features/hero-banner';

export default function HeroBannerPage() {
  const { data: fetchedBanners = [], isLoading } = useHeroBanners();
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);

  useEffect(() => {
    if (fetchedBanners.length) setHeroBanners(fetchedBanners);
  }, [fetchedBanners]);

  const [previewImage, setPreviewImage] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [bulkEntries, setBulkEntries] = useState<BannerFormEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HeroBanner | null>(null);

  const qc = useQueryClient();
  const deleteMutation = useDeleteHeroBanner();
  const toggleMutation = useToggleHeroBanner();
  const reorderMutation = useReorderHeroBanners();
  const uploadMutation = useUploadHeroBannerImage();

  const openBulkModal = () => {
    setBulkEntries([createEntry(heroBanners.length)]);
    setEditingBanner(null);
    setIsBulkModalOpen(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    const entry = createEntry(banner.order);
    Object.assign(entry, {
      title: banner.title, subtitle: banner.subtitle || '',
      largeImage: banner.largeImage || '', smallImage: banner.smallImage || '',
      videoUrl: banner.videoUrl || '', buttonUrl: banner.buttonUrl || '',
      buttonText: banner.buttonText || '', isActive: banner.isActive,
      largePreview: banner.largeImage || '', smallPreview: banner.smallImage || '',
    });
    setBulkEntries([entry]);
    setEditingBanner(banner);
    setIsBulkModalOpen(true);
  };

  const closeBulkModal = () => {
    setIsBulkModalOpen(false);
    setBulkEntries([]);
    setEditingBanner(null);
  };

  const addEntry = () => setBulkEntries((p) => [...p, createEntry(heroBanners.length + p.length)]);
  const removeEntry = (id: string) => setBulkEntries((p) => (p.length > 1 ? p.filter((e) => e.id !== id) : p));
  const duplicateEntry = (id: string) => setBulkEntries((p) => {
    const src = p.find((e) => e.id === id);
    if (!src) return p;
    const copy = createEntry(src.order + 1);
    Object.assign(copy, {
      title: src.title, subtitle: src.subtitle,
      largeImage: src.largeImage, smallImage: src.smallImage,
      videoUrl: src.videoUrl, buttonUrl: src.buttonUrl,
      buttonText: src.buttonText, isActive: src.isActive,
      largePreview: src.largePreview, smallPreview: src.smallPreview,
    });
    return [...p, copy];
  });

  const updateEntry = (id: string, field: keyof BannerFormEntry, value: any) =>
    setBulkEntries((p) => p.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const handleUploadImage = async (file: File, entryId: string, type: 'large' | 'small') => {
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return; }
    if (!file.type.startsWith('image/')) { toast.error('Images only'); return; }
    const uField = type === 'large' ? 'isUploadingLarge' : 'isUploadingSmall';
    const iField = type === 'large' ? 'largeImage' : 'smallImage';
    const pField = type === 'large' ? 'largePreview' : 'smallPreview';
    updateEntry(entryId, uField, true);
    try {
      const url = await uploadMutation.mutateAsync(file);
      if (url) {
        updateEntry(entryId, iField, url);
        updateEntry(entryId, pField, url);
      }
    } catch {
      // error toast handled by mutation
    } finally {
      updateEntry(entryId, uField, false);
    }
  };

  const removeImg = (entryId: string, type: 'large' | 'small') => {
    updateEntry(entryId, type === 'large' ? 'largeImage' : 'smallImage', '');
    updateEntry(entryId, type === 'large' ? 'largePreview' : 'smallPreview', '');
  };

  const handleBulkSubmit = async () => {
    const valid = bulkEntries.filter((e) => e.title.trim());
    if (!valid.length) { toast.error('At least one banner needs a title'); return; }
    setIsSubmitting(true);
    let ok = 0, fail = 0;
    for (let i = 0; i < valid.length; i++) {
      const e = valid[i];
      const payload = {
        title: e.title, subtitle: e.subtitle || undefined,
        largeImage: e.largeImage || undefined, smallImage: e.smallImage || undefined,
        videoUrl: e.videoUrl || undefined, buttonUrl: e.buttonUrl || undefined,
        buttonText: e.buttonText || undefined, isActive: e.isActive,
        order: heroBanners.length + i,
      };
      try {
        if (editingBanner && i === 0) await api.put(`/api/v1/hero-banners/${editingBanner.id}`, payload);
        else await api.post('/api/v1/hero-banners', payload);
        ok++;
      } catch (err) {
        fail++;
        if (axios.isAxiosError(err)) clientLogger.error(`Failed "${e.title}":`, err.response?.data);
      }
    }
    if (ok > 0) { toast.success(`${ok} saved`); closeBulkModal(); qc.invalidateQueries({ queryKey: ['hero-banners'] }); }
    if (fail > 0) toast.error(`${fail} failed`);
    setIsSubmitting(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => { toast.success('Deleted'); setDeleteTarget(null); },
    });
  };

  const handleToggle = (banner: HeroBanner) => toggleMutation.mutate(banner.id);

  const handleReorder = async (id: string, dir: 'up' | 'down') => {
    const idx = heroBanners.findIndex((b) => b.id === id);
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === heroBanners.length - 1)) return;
    const copy = [...heroBanners];
    const tgt = dir === 'up' ? idx - 1 : idx + 1;
    [copy[idx].order, copy[tgt].order] = [copy[tgt].order, copy[idx].order];
    copy.sort((a, b) => a.order - b.order);
    try {
      await reorderMutation.mutateAsync(copy.map((b, i) => ({ id: b.id, order: i })));
      setHeroBanners(copy);
    } catch { qc.invalidateQueries({ queryKey: ['hero-banners'] }); }
  };

  return (
    <DashboardLayout title="Hero Banners">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black outer-sans">Hero Banners</h1>
            <p className="text-black text-lg mt-2">Manage homepage banners — bulk create supported</p>
          </div>
          <button type="button" onClick={openBulkModal}
            className="bg-[#D4AF37] text-white px-4 py-2.5 outer-sans text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold">
            <Plus className="w-4 h-4" />
            Add Banners
          </button>
        </div>

        <HeroBannerGrid
          banners={heroBanners}
          isLoading={isLoading}
          onEdit={openEditModal}
          onToggle={handleToggle}
          onDelete={setDeleteTarget}
          onReorder={handleReorder}
          onPreview={setPreviewImage}
        />
      </div>

      <AnimatePresence>
        {previewImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImage('')}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
              {previewImage.includes('video') ? (
                <video src={previewImage} controls autoPlay className="w-full rounded-lg" />
              ) : (
                <img src={previewImage} alt="" className="w-full rounded-lg" crossOrigin="anonymous" />
              )}
              <button type="button" onClick={() => setPreviewImage('')}
                className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <HeroBannerBulkModal
        isOpen={isBulkModalOpen}
        onClose={closeBulkModal}
        entries={bulkEntries}
        onUpdateEntry={updateEntry}
        onUploadImage={handleUploadImage}
        onRemoveImage={removeImg}
        onAddEntry={addEntry}
        onDuplicateEntry={duplicateEntry}
        onRemoveEntry={removeEntry}
        onSubmit={handleBulkSubmit}
        isSubmitting={isSubmitting}
        editingBanner={editingBanner}
      />

      <HeroBannerDeleteAlert
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        bannerTitle={deleteTarget?.title}
        isPending={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}
