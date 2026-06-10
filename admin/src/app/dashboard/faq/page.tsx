'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useFAQs,
  useCreateFAQ,
  useUpdateFAQ,
  useDeleteFAQ,
  useToggleFAQ,
  FAQList,
  FAQFormModal,
} from '@/features/faq';
import type { FAQItem } from '@/features/faq';

export default function FAQPage() {
  const { faqs, isLoading, fetchFAQs, setFAQs } = useFAQs();
  const { create, isCreating } = useCreateFAQ();
  const { update, isUpdating } = useUpdateFAQ();
  const { deleteFAQ, isDeleting } = useDeleteFAQ();
  const { toggle, isToggling } = useToggleFAQ();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  const openCreateModal = () => {
    setEditingFAQ(null);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FAQItem) => {
    setEditingFAQ(faq);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFAQ(null);
  };

  const handleSubmit = useCallback(
    async (payload: Partial<FAQItem>) => {
      setIsSubmitting(true);
      try {
        if (editingFAQ) {
          const updated = await update(editingFAQ.id, payload);
          if (updated) {
            setFAQs((prev) => prev.map((f) => (f.id === editingFAQ.id ? updated : f)));
            closeModal();
          }
        } else {
          const created = await create(payload);
          if (created) {
            setFAQs((prev) => [...prev, created]);
            closeModal();
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingFAQ, update, create, setFAQs],
  );

  const handleDelete = useCallback(
    async (faq: FAQItem) => {
      const confirmed = window.confirm(`Delete "${faq.question}"? This cannot be undone.`);
      if (!confirmed) return;
      const ok = await deleteFAQ(faq.id);
      if (ok) {
        setFAQs((prev) => prev.filter((f) => f.id !== faq.id));
      }
    },
    [deleteFAQ, setFAQs],
  );

  const handleToggle = useCallback(
    async (faq: FAQItem) => {
      const updated = await toggle(faq.id);
      if (updated) {
        setFAQs((prev) => prev.map((f) => (f.id === faq.id ? updated : f)));
      }
    },
    [toggle, setFAQs],
  );

  return (
    <DashboardLayout title="FAQ Management">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">FAQ Management</h1>
            <p className="text-black text-lg mt-2">Manage frequently asked questions</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>

        <FAQList
          faqs={faqs}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      </div>

      <FAQFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        faq={editingFAQ}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </DashboardLayout>
  );
}
