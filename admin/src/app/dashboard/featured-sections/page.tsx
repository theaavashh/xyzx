'use client';

import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import type { FeaturedSection } from '@/features/featured-sections';
import { useFeaturedSections, FeaturedSectionGrid, FeaturedSectionModal, FeaturedSectionDeleteAlert } from '@/features/featured-sections';

export default function FeaturedSectionsPage() {
  const { featuredSections, isLoading, createSection, updateSection, deleteSection, toggleStatus, reorder, uploadImage } = useFeaturedSections();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<FeaturedSection | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<FeaturedSection | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const openModal = useCallback(() => { setEditingSection(null); setIsModalOpen(true); }, []);
  const openEditModal = useCallback((s: FeaturedSection) => { setEditingSection(s); setIsModalOpen(true); }, []);
  const closeModal = useCallback(() => { setIsModalOpen(false); }, []);

  const handleSave = useCallback(
    async (data: Parameters<typeof createSection>[0]) => {
      if (!data.image) { toast.error('Image is required'); return; }
      if (editingSection) await updateSection(editingSection.id, data);
      else await createSection(data);
      closeModal();
    },
    [editingSection, createSection, updateSection, closeModal],
  );

  const handleDelete = useCallback(async () => {
    if (!sectionToDelete) return;
    await deleteSection(sectionToDelete);
    setSectionToDelete(null);
  }, [sectionToDelete, deleteSection]);

  const handleUploadImage = useCallback(async () => {
    setIsUploading(true);
    const url = await uploadImage();
    setIsUploading(false);
    return url;
  }, [uploadImage]);

  return (
    <DashboardLayout title="Featured Sections">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black lastik">Featured Sections</h1>
            <p className="text-black text-lg mt-2">Manage promotional banners with images and CTAs</p>
          </div>
          <button type="button" onClick={openModal} className="bg-[#D4AF37] text-white px-4 py-2.5 lastik text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold">
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="p-6">
            <FeaturedSectionGrid sections={featuredSections} isLoading={isLoading} onEdit={openEditModal} onToggle={toggleStatus} onDelete={setSectionToDelete} onReorder={reorder} onAdd={openModal} />
          </div>
        </div>
      </div>
      <FeaturedSectionModal isOpen={isModalOpen} editingSection={editingSection} isUploading={isUploading} onClose={closeModal} onSave={handleSave} onUploadImage={handleUploadImage} />
      <FeaturedSectionDeleteAlert isOpen={!!sectionToDelete} onClose={() => setSectionToDelete(null)} onConfirm={handleDelete} />
    </DashboardLayout>
  );
}
