'use client';

import { useState } from 'react';
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
  const { data: heroBanners = [], isLoading } = useHeroBanners();

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
      position: banner.position || 'CENTER',
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

  const handleUploadImage = async (file: File, _entryId: string, _type: 'large' | 'small'): Promise<string | null> => {
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) { toast.error(isVideo ? 'Max 50MB for videos' : 'Max 5MB for images'); return null; }
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) { toast.error('Images and videos only'); return null; }
    try {
      return await uploadMutation.mutateAsync(file);
    } catch {
      return null;
    }
  };

  const handleBulkSubmit = async (validEntries: BannerFormEntry[]) => {
    if (!validEntries.length) return;
    setIsSubmitting(true);
    let ok = 0, fail = 0;
    const failures: string[] = [];
    for (let i = 0; i < validEntries.length; i++) {
      const e = validEntries[i];
      const payload = {
        title: e.title || undefined, subtitle: e.subtitle || undefined,
        largeImage: e.largeImage || undefined, smallImage: e.smallImage || undefined,
        videoUrl: e.videoUrl || undefined, buttonUrl: e.buttonUrl || undefined,
        buttonText: e.buttonText || undefined, isActive: e.isActive,
        position: e.position || 'CENTER',
        order: heroBanners.length + i,
      };
      try {
        if (editingBanner && i === 0) await api.put(`/api/v1/hero-banners/${editingBanner.id}`, payload);
        else await api.post('/api/v1/hero-banners', payload);
        ok++;
      } catch (err) {
        fail++;
        const msg = axios.isAxiosError(err)
          ? (typeof err.response?.data?.message === 'string' ? err.response.data.message : err.message)
          : 'Unexpected error';
        failures.push(msg);
        clientLogger.error(`Failed "${e.title}":`, axios.isAxiosError(err) ? err.response?.data : err);
      }
    }
    if (ok > 0) { toast.success(editingBanner ? 'Banner updated successfully' : `${ok} banner${ok > 1 ? 's' : ''} created successfully`); closeBulkModal(); qc.invalidateQueries({ queryKey: ['hero-banners'] }); }
    if (fail > 0) toast.error(`${fail} failed${failures[0] ? `: ${failures[0]}` : ''}`);
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
    qc.setQueryData(['hero-banners'], copy);
    try {
      await reorderMutation.mutateAsync(copy.map((b, i) => ({ id: b.id, order: i })));
    } catch {
      qc.invalidateQueries({ queryKey: ['hero-banners'] });
    }
  };

  return (
    <DashboardLayout title="Hero Banners">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Hero Banners</h1>
            <p className="text-black text-lg mt-2">Manage homepage banners — bulk create supported</p>
          </div>
          <button type="button" onClick={openBulkModal}
            className="bg-black text-white px-4 py-2.5 text-lg rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black flex items-center gap-2 transition-all font-semibold">
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
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setPreviewImage(''); }}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="relative max-w-3xl w-full h-[80vh] bg-white flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {previewImage.includes('video') ? (
                  <video src={previewImage} controls autoPlay className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <img src={previewImage} alt="" className="w-full h-full object-contain rounded-lg" crossOrigin="anonymous" />
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
        initialEntries={bulkEntries}
        onUploadImage={handleUploadImage}
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
