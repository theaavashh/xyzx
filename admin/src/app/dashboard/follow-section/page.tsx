'use client';

import { Building2, Edit3, Plus, RotateCcw, Share2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useFollowSection,
  useCreateFollowSection,
  useUpdateFollowSection,
  useDeleteFollowSection,
  useToggleFollowSection,
} from '@/features/follow-section';
import {
  FollowSectionModal,
  FollowSectionDeleteAlert,
  DEFAULT_FORM_STATE,
} from '@/features/follow-section';
import type { FollowSection, FollowSectionFormState } from '@/features/follow-section';

function socialLinksFromSection(section: FollowSection): { facebookUrl: string; instagramUrl: string; tiktokUrl: string } {
  const links = section.socialLinks || [];
  const find = (name: string) => links.find((l) => l.name.toLowerCase() === name.toLowerCase())?.url || '';
  return {
    facebookUrl: find('Facebook'),
    instagramUrl: find('Instagram'),
    tiktokUrl: find('TikTok'),
  };
}

function sectionToFormData(section: FollowSection): FollowSectionFormState {
  const socials = socialLinksFromSection(section);
  return {
    copyrightText: section.copyrightText,
    designerCredit: section.designerCredit,
    showPaymentIcons: section.showPaymentIcons,
    isActive: section.isActive,
    facebookUrl: socials.facebookUrl,
    instagramUrl: socials.instagramUrl,
    tiktokUrl: socials.tiktokUrl,
  };
}

function formDataToPayload(data: FollowSectionFormState) {
  const socialLinks: { name: string; url: string; icon: string; ariaLabel: string; order: number; isActive: boolean }[] = [];
  if (data.facebookUrl.trim()) {
    socialLinks.push({ name: 'Facebook', url: data.facebookUrl, icon: 'Facebook', ariaLabel: 'Follow us on Facebook', order: 0, isActive: true });
  }
  if (data.instagramUrl.trim()) {
    socialLinks.push({ name: 'Instagram', url: data.instagramUrl, icon: 'Instagram', ariaLabel: 'Follow us on Instagram', order: 1, isActive: true });
  }
  if (data.tiktokUrl.trim()) {
    socialLinks.push({ name: 'TikTok', url: data.tiktokUrl, icon: 'Music', ariaLabel: 'Follow us on TikTok', order: 2, isActive: true });
  }

  return {
    copyrightText: data.copyrightText,
    designerCredit: data.designerCredit,
    showPaymentIcons: data.showPaymentIcons,
    isActive: data.isActive,
    socialLinks,
  };
}

export default function FollowSectionPage() {
  const { data: sections = [], isLoading } = useFollowSection();
  const createMutation = useCreateFollowSection();
  const updateMutation = useUpdateFollowSection();
  const deleteMutation = useDeleteFollowSection();
  const toggleMutation = useToggleFollowSection();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FollowSection | null>(null);
  const [form, setForm] = useState<FollowSectionFormState>({ ...DEFAULT_FORM_STATE });
  const [deleteTarget, setDeleteTarget] = useState<FollowSection | null>(null);

  const openModal = useCallback((item?: FollowSection) => {
    if (item) {
      setForm(sectionToFormData(item));
      setEditingItem(item);
    } else {
      setForm({ ...DEFAULT_FORM_STATE });
      setEditingItem(null);
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
    setForm({ ...DEFAULT_FORM_STATE });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const payload = formDataToPayload(form);
      if (editingItem) {
        updateMutation.mutate({ id: editingItem.id, data: payload }, {
          onSuccess: () => closeModal(),
        });
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => closeModal(),
        });
      }
    },
    [editingItem, form, createMutation, updateMutation, closeModal],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }, [deleteTarget, deleteMutation]);

  const handleToggleActive = useCallback(
    (checked: boolean) => {
      setForm((prev) => ({ ...prev, isActive: checked }));
    },
    [],
  );

  return (
    <DashboardLayout title="Follow Section Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Follow Section Management</h1>
            <p className="text-black text-lg mt-2">
              Manage social media links and footer information
            </p>
          </div>
          <button
            type="button"
            onClick={() => openModal(sections[0])}
            className="bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
          >
            <Edit3 className="w-4 h-4" />
            {sections.length > 0 ? 'Edit Follow Section' : 'Add Follow Section'}
          </button>
        </div>

        <div className="bg-white rounded-xl">
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading follow sections...</p>
              </div>
            ) : sections.length === 0 ? (
              <div className="text-center py-12">
                <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No follow sections found</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first follow section</p>
                <button
                  type="button"
                  onClick={() => openModal()}
                  className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Follow Section
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((item) => {
                  const socials = socialLinksFromSection(item);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#D4AF37]/10 rounded-lg">
                              <Building2 className="w-6 h-6 text-[#A68520]" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Follow Section</h3>
                              <p className="text-sm text-gray-500 mt-1">{item.copyrightText}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              type="button"
                              onClick={() => openModal(item)}
                              className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors text-sm"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-[#A68520]" />
                            Social Links
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {socials.facebookUrl && (
                              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-bold text-blue-600">f</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900">Facebook</p>
                                  <p className="text-xs text-gray-500 truncate">{socials.facebookUrl}</p>
                                </div>
                              </div>
                            )}
                            {socials.instagramUrl && (
                              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-bold text-pink-600">ig</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900">Instagram</p>
                                  <p className="text-xs text-gray-500 truncate">{socials.instagramUrl}</p>
                                </div>
                              </div>
                            )}
                            {socials.tiktokUrl && (
                              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-bold text-white">tk</span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900">TikTok</p>
                                  <p className="text-xs text-gray-500 truncate">{socials.tiktokUrl}</p>
                                </div>
                              </div>
                            )}
                            {!socials.facebookUrl && !socials.instagramUrl && !socials.tiktokUrl && (
                              <p className="text-sm text-gray-400 italic col-span-3">No social links added</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <FollowSectionModal
        isOpen={isModalOpen}
        isSaving={createMutation.isPending || updateMutation.isPending}
        editingItem={editingItem}
        form={form}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onFormChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        onToggleActive={handleToggleActive}
      />

      <FollowSectionDeleteAlert
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        sectionName={deleteTarget?.copyrightText || 'this follow section'}
        isPending={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}
