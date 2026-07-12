'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Plus } from 'lucide-react';
import { useDualCardSections } from '@/features/dual-card-section';
import { DualCardSectionGrid } from '@/features/dual-card-section';
import { DualCardSectionModal } from '@/features/dual-card-section';
import { DualCardSectionDeleteAlert } from '@/features/dual-card-section';

export default function DualCardSectionPage() {
  const {
    sections,
    isLoading,
    isModalOpen,
    editingSection,
    showDeleteConfirm,
    sectionToDelete,
    isUploading,
    isSaving,
    form,
    openModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleReorder,
    handleCardImageUpload,
    updateCardField,
    handleFormChange,
    setShowDeleteConfirm,
    setSectionToDelete,
  } = useDualCardSections();

  return (
    <DashboardLayout title="Dual Card Sections">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black outer-sans">Dual Card Sections</h1>
            <p className="text-black text-lg mt-2">Manage side-by-side promotional cards</p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="bg-[#D4AF37] text-white px-4 py-2.5 outer-sans text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="p-6">
            <DualCardSectionGrid
              sections={sections}
              isLoading={isLoading}
              onEdit={openEditModal}
              onToggle={handleToggleStatus}
              onDelete={(section) => { setSectionToDelete(section); setShowDeleteConfirm(true); }}
              onReorder={handleReorder}
              onAdd={openModal}
            />
          </div>
        </div>
      </div>

      <DualCardSectionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        form={form}
        onSubmit={handleSubmit}
        editingSection={editingSection}
        isUploading={isUploading}
        isSaving={isSaving}
        onCardImageUpload={handleCardImageUpload}
        onUpdateCardField={updateCardField}
        onFormChange={handleFormChange}
      />

      <DualCardSectionDeleteAlert
        isOpen={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setSectionToDelete(null); }}
        onConfirm={() => sectionToDelete && handleDelete(sectionToDelete)}
      />
    </DashboardLayout>
  );
}
