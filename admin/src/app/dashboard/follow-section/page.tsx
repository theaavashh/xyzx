'use client';

import { Building2, Edit3, MapPin, Package, Plus, RotateCcw, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useFollowSection,
  useCreateFollowSection,
  useUpdateFollowSection,
  useDeleteFollowSection,
  useToggleFollowSection,
  useUploadFollowSectionImage,
} from '@/features/follow-section';
import {
  FollowSectionModal,
  FollowSectionDeleteAlert,
  DEFAULT_FORM_STATE,
} from '@/features/follow-section';
import type { FollowSection } from '@/features/follow-section';

export default function FollowSectionPage() {
  const { data: sections = [], isLoading } = useFollowSection();
  const createMutation = useCreateFollowSection();
  const updateMutation = useUpdateFollowSection();
  const deleteMutation = useDeleteFollowSection();
  const toggleMutation = useToggleFollowSection();
  const uploadMutation = useUploadFollowSectionImage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FollowSection | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState<Partial<FollowSection>>({ ...DEFAULT_FORM_STATE });

  const [deleteTarget, setDeleteTarget] = useState<FollowSection | null>(null);

  const openModal = useCallback((item?: FollowSection) => {
    if (item) {
      setForm({ ...item });
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

  const sanitizeForm = useCallback((data: Partial<FollowSection>) => {
    const { id, createdAt, updatedAt, ...rest } = data;
    return rest as Record<string, unknown>;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const existing = editingItem;
      const payload = sanitizeForm(form);
      if (existing) {
        updateMutation.mutate({ id: existing.id, data: payload }, {
          onSuccess: () => closeModal(),
        });
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => closeModal(),
        });
      }
    },
    [editingItem, form, createMutation, updateMutation, closeModal, sanitizeForm],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }, [deleteTarget, deleteMutation]);

  const handleServiceImageUpload = useCallback(
    async (index: number, file: File) => {
      setIsUploading(true);
      try {
        const url = await uploadMutation.mutateAsync(file);
        if (url) {
          setForm((prev) => ({
            ...prev,
            serviceItems: (prev.serviceItems || []).map((item, i) =>
              i === index ? { ...item, image: url } : item,
            ),
          }));
        }
      } finally {
        setIsUploading(false);
      }
    },
    [uploadMutation],
  );

  const addServiceItem = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      serviceItems: [
        ...(prev.serviceItems || []),
        { title: '', description: '', image: '', order: (prev.serviceItems || []).length, isActive: true },
      ],
    }));
  }, []);

  const removeServiceItem = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      serviceItems: (prev.serviceItems || []).filter((_, i) => i !== index),
    }));
  }, []);

  const updateServiceItem = useCallback(
    (index: number, field: string, value: string | number | boolean) => {
      setForm((prev) => ({
        ...prev,
        serviceItems: (prev.serviceItems || []).map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      }));
    },
    [],
  );

  const addSocialLink = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [
        ...(prev.socialLinks || []),
        { name: '', url: '', icon: 'Facebook', ariaLabel: '', order: (prev.socialLinks || []).length, isActive: true },
      ],
    }));
  }, []);

  const removeSocialLink = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((_, i) => i !== index),
    }));
  }, []);

  const updateSocialLink = useCallback(
    (index: number, field: string, value: string | number | boolean) => {
      setForm((prev) => ({
        ...prev,
        socialLinks: (prev.socialLinks || []).map((link, i) =>
          i === index ? { ...link, [field]: value } : link,
        ),
      }));
    },
    [],
  );

  return (
    <DashboardLayout title="Follow Section Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black outer-sans">Follow Section Management</h1>
            <p className="text-black text-lg mt-2">
              Manage service items, social links, and footer address information
            </p>
          </div>
          <button
            type="button"
            onClick={() => openModal(sections[0])}
            className="bg-[#D4AF37] text-white px-4 py-2.5 outer-sans text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
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
                {sections.map((item) => (
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
                            <h3 className="text-lg font-semibold text-gray-900">{item.brandName}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {item.street}, {item.city}, {item.state} {item.zip}, {item.country}
                            </p>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4 text-[#A68520]" />
                            Service Items ({item.serviceItems.length})
                          </h4>
                          <div className="space-y-2">
                            {item.serviceItems.map((service, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                {service.image && (
                                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={service.image}
                                      alt={service.title}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{service.title}</p>
                                  <p className="text-xs text-gray-500 truncate">{service.description}</p>
                                </div>
                              </div>
                            ))}
                            {item.serviceItems.length === 0 && (
                              <p className="text-sm text-gray-400 italic">No service items added</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-[#A68520]" />
                            Social Links ({item.socialLinks.length})
                          </h4>
                          <div className="space-y-2">
                            {item.socialLinks.map((social, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-medium text-gray-600">
                                    {social.icon.charAt(0)}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{social.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{social.url}</p>
                                </div>
                              </div>
                            ))}
                            {item.socialLinks.length === 0 && (
                              <p className="text-sm text-gray-400 italic">No social links added</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FollowSectionModal
        isOpen={isModalOpen}
        isSaving={createMutation.isPending || updateMutation.isPending}
        isUploading={isUploading}
        editingItem={editingItem}
        form={form}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onFormChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        onAddService={addServiceItem}
        onRemoveService={removeServiceItem}
        onUpdateService={updateServiceItem}
        onServiceImageUpload={handleServiceImageUpload}
        onAddSocial={addSocialLink}
        onRemoveSocial={removeSocialLink}
        onUpdateSocial={updateSocialLink}
        onToggleActive={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
      />

      <FollowSectionDeleteAlert
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        sectionName={deleteTarget?.brandName}
        isPending={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}
