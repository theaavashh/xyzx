'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useImageGridQueries,
  ImageGridGrid,
  ImageGridModal,
  ImageGridDeleteAlert,
} from '@/features/image-grid';
import type { ImageGridItem, ImageGridForm } from '@/features/image-grid';

export default function ImageGridPage() {
  const {
    items,
    isLoading,
    isUploading,
    createOrUpdate,
    remove,
    toggleStatus,
    reorder,
    uploadImage,
  } = useImageGridQueries();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ImageGridItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ImageGridItem | null>(null);

  const handleSubmit = async (form: ImageGridForm) => {
    const ok = await createOrUpdate(form, editingItem);
    if (ok) {
      setIsModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await remove(deleteTarget);
    if (ok) setDeleteTarget(null);
  };

  const openCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: ImageGridItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout title="Image Grid">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Image Grid
            </h1>
            <p className="text-black text-lg mt-2">
              Manage image grid items displayed on the homepage
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <ImageGridGrid
              items={items}
              isLoading={isLoading}
              onEdit={openEdit}
              onToggle={toggleStatus}
              onDelete={setDeleteTarget}
              onReorder={reorder}
              onAdd={openCreate}
            />
          </div>
        </div>
      </div>

      <ImageGridModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        editingItem={editingItem}
        isUploading={isUploading}
        onUploadImage={uploadImage}
      />

      <ImageGridDeleteAlert
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemTitle={deleteTarget?.title || ''}
      />
    </DashboardLayout>
  );
}
