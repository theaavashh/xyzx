'use client';

import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { AboutSection } from '@/features/about';
import { useAboutSections, AboutSectionGrid, AboutSectionModal, AboutSectionDeleteAlert } from '@/features/about';

export default function AboutPage() {
  const { sections, isLoading, createSection, updateSection, deleteSection, toggleStatus } = useAboutSections();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<AboutSection | null>(null);

  const openModal = useCallback(() => { setEditingSection(null); setIsModalOpen(true); }, []);
  const openEditModal = useCallback((s: AboutSection) => { setEditingSection(s); setIsModalOpen(true); }, []);
  const closeModal = useCallback(() => { setIsModalOpen(false); }, []);

  const handleSave = useCallback(
    async (data: Parameters<typeof createSection>[0]) => {
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

  return (
    <DashboardLayout title="About Section">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">About Section</h1>
            <p className="text-black text-lg mt-2">Manage the full About Us page content</p>
          </div>
          <button type="button" onClick={openModal} className="bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold">
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="p-6">
            <AboutSectionGrid sections={sections} isLoading={isLoading} onEdit={openEditModal} onToggle={toggleStatus} onDelete={setSectionToDelete} onAdd={openModal} />
          </div>
        </div>
      </div>
      <AboutSectionModal isOpen={isModalOpen} editingSection={editingSection} onClose={closeModal} onSave={handleSave} />
      <AboutSectionDeleteAlert isOpen={!!sectionToDelete} onClose={() => setSectionToDelete(null)} onConfirm={handleDelete} />
    </DashboardLayout>
  );
}
