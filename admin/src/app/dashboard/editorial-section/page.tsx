'use client';

import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  EditorialSectionGrid,
  EditorialSectionModal,
  EditorialSectionDeleteAlert,
  useEditorialSectionQueries,
} from '@/features/editorial-section';

export default function EditorialSectionPage() {
  const {
    sections,
    isLoading,
    isModalOpen,
    editingSection,
    showDeleteConfirm,
    sectionToDelete,
    isFetchingProducts,
    fetchedProducts,
    selectedProductIds,
    form,
    handleFormChange,
    fetchProductsByFeature,
    toggleProduct,
    openModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleReorder,
    getProductThumb,
    setShowDeleteConfirm,
    setSectionToDelete,
  } = useEditorialSectionQueries();

  return (
    <DashboardLayout title="Editorial Sections">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black lastik">Editorial Sections</h1>
            <p className="text-black text-lg mt-2">Showcase products by feature type</p>
          </div>
          {sections.length === 0 && (
            <button type="button" onClick={openModal}
              className="bg-[#D4AF37] text-white px-4 py-2.5 lastik text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold">
              <Plus className="w-4 h-4" /> Add Section
            </button>
          )}
        </div>

        <EditorialSectionGrid
          sections={sections}
          isLoading={isLoading}
          onOpenModal={openModal}
          onEdit={openEditModal}
          onToggleStatus={handleToggleStatus}
          onReorder={handleReorder}
          onDeleteRequest={(section) => {
            setSectionToDelete(section);
            setShowDeleteConfirm(true);
          }}
        />

        <EditorialSectionModal
          isOpen={isModalOpen}
          editingSection={editingSection}
          form={form}
          isFetchingProducts={isFetchingProducts}
          fetchedProducts={fetchedProducts}
          selectedProductIds={selectedProductIds}
          onFormChange={handleFormChange}
          onFetchProducts={fetchProductsByFeature}
          onToggleProduct={toggleProduct}
          onSubmit={handleSubmit}
          onClose={closeModal}
          getProductThumb={getProductThumb}
        />

        <EditorialSectionDeleteAlert
          show={showDeleteConfirm}
          section={sectionToDelete}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setSectionToDelete(null);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
