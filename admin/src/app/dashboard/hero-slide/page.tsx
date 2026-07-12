'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useHeroSlideQueries,
  HeroSlideGrid,
  HeroSlideModal,
  HeroSlideDeleteAlert,
} from '@/features/hero-slide';
import type { HeroSlide, HeroSlideForm } from '@/features/hero-slide';

export default function HeroSlidePage() {
  const { items, isLoading, isUploading, createOrUpdate, remove, toggleStatus, reorder, uploadImage } = useHeroSlideQueries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroSlide | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null);

  const handleSubmit = async (form: HeroSlideForm) => {
    const ok = await createOrUpdate(form, editingItem);
    if (ok) { setIsModalOpen(false); setEditingItem(null); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await remove(deleteTarget);
    if (ok) setDeleteTarget(null);
  };

  return (
    <DashboardLayout title="Hero Slides">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black outer-sans">Hero Slides</h1>
            <p className="text-black text-lg mt-2">Manage hero carousel slides displayed on the homepage</p>
          </div>
          <button type="button" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="bg-[#D4AF37] text-white px-4 py-2.5 outer-sans text-lg rounded-md hover:bg-[#b8962e] flex items-center gap-2 font-semibold">
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <HeroSlideGrid items={items} isLoading={isLoading}
              onEdit={(item) => { setEditingItem(item); setIsModalOpen(true); }}
              onToggle={toggleStatus} onDelete={setDeleteTarget} onReorder={reorder}
              onAdd={() => { setEditingItem(null); setIsModalOpen(true); }} />
          </div>
        </div>
      </div>
      <HeroSlideModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSubmit={handleSubmit} editingItem={editingItem} isUploading={isUploading} onUploadImage={uploadImage} />
      <HeroSlideDeleteAlert isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} itemTitle={deleteTarget?.title} />
    </DashboardLayout>
  );
}
