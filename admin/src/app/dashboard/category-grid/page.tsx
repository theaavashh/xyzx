'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useCategoryGridQueries,
  CategoryGridGrid,
  CategoryGridModal,
  CategoryGridDeleteAlert,
} from '@/features/category-grid';
import type { CategoryGridItem, CategoryGridForm } from '@/features/category-grid';

export default function CategoryGridPage() {
  const {
    items,
    isLoading,
    isUploading,
    createOrUpdate,
    remove,
    toggleStatus,
    reorder,
    uploadImage,
  } = useCategoryGridQueries();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryGridItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryGridItem | null>(null);

  const handleSubmit = async (form: CategoryGridForm) => {
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

  const openEdit = (item: CategoryGridItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout title="Category Grid">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Category Grid
            </h1>
            <p className="text-black text-lg mt-2">
              Manage category grid items displayed on the homepage
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
            <CategoryGridGrid
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

      <CategoryGridModal
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

      <CategoryGridDeleteAlert
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemTitle={deleteTarget?.title}
      />
    </DashboardLayout>
  );
}
