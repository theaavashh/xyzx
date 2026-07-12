'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useFooterCatalogQueries,
  FooterCatalogList,
  FooterCatalogModal,
  FooterCatalogDeleteAlert,
} from '@/features/footer-catalog';
import type { FooterCatalog, FooterCatalogForm } from '@/features/footer-catalog';

export default function FooterCatalogPage() {
  const {
    catalogs,
    isLoading,
    createOrUpdate,
    remove,
    toggleStatus,
    reorder,
  } = useFooterCatalogQueries();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FooterCatalog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FooterCatalog | null>(null);

  const handleSubmit = async (form: FooterCatalogForm) => {
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

  const openEdit = (item: FooterCatalog) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout title="Footer Catalog Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black outer-sans">
              Footer Catalog Management
            </h1>
            <p className="text-black text-lg mt-2">
              Manage footer category sections and their links
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="bg-[#D4AF37] text-white px-4 py-2.5 outer-sans text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Category Section
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <FooterCatalogList
              items={catalogs}
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

      <FooterCatalogModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        editingItem={editingItem}
      />

      <FooterCatalogDeleteAlert
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemTitle={deleteTarget?.title}
      />
    </DashboardLayout>
  );
}
