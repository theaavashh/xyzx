'use client';

import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useFooterSectionQueries,
  FooterSectionList,
  FooterSectionModal,
  FooterSectionLinkModal,
  FooterSectionDeleteAlert,
} from '@/features/footer-section';

export default function FooterSectionPage() {
  const {
    sections,
    isLoading,
    isSaving,
    isSectionModalOpen,
    editingSection,
    sectionForm,
    expandedItems,
    showDeleteConfirm,
    sectionToDelete,
    isLinkModalOpen,
    editingLinkIndex,
    linkForm,
    openSectionModal,
    closeSectionModal,
    handleSectionFormChange,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleReorder,
    toggleExpand,
    openLinkModal,
    closeLinkModal,
    saveLink,
    removeLink,
    handleLinkFormChange,
    setShowDeleteConfirm,
    setSectionToDelete,
  } = useFooterSectionQueries();

  return (
    <DashboardLayout title="Footer Section Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black lastik">
              Footer Section Management
            </h1>
            <p className="text-black text-lg mt-2">
              Manage footer link sections (Company, Help, Policies, Quick Links)
            </p>
          </div>
          <button
            type="button"
            onClick={() => openSectionModal()}
            className="bg-[#D4AF37] text-white px-4 py-2.5 lastik text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>

        <FooterSectionList
          sections={sections}
          isLoading={isLoading}
          expandedItems={expandedItems}
          onToggleExpand={toggleExpand}
          onEdit={openSectionModal}
          onToggleStatus={handleToggleStatus}
          onReorder={handleReorder}
          onDeleteRequest={(item) => {
            setSectionToDelete(item);
            setShowDeleteConfirm(true);
          }}
          onAdd={() => openSectionModal()}
        />
      </div>

      <FooterSectionModal
        isOpen={isSectionModalOpen}
        editingSection={editingSection}
        sectionForm={sectionForm}
        isSaving={isSaving}
        onFormChange={handleSectionFormChange}
        onSubmit={handleSubmit}
        onClose={closeSectionModal}
        onAddLink={() => openLinkModal()}
        onEditLink={(index) => openLinkModal(index)}
        onRemoveLink={removeLink}
      />

      <FooterSectionLinkModal
        isOpen={isLinkModalOpen}
        linkForm={linkForm}
        editingLinkIndex={editingLinkIndex}
        onFormChange={handleLinkFormChange}
        onSave={saveLink}
        onClose={closeLinkModal}
      />

      <FooterSectionDeleteAlert
        show={showDeleteConfirm}
        section={sectionToDelete}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSectionToDelete(null);
        }}
      />
    </DashboardLayout>
  );
}
