'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { DualCard, DualCardSection, DualCardFormState } from '../types';
import { createCard } from '../types';

export function useDualCardSections() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sections, setSections] = useState<DualCardSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<DualCardSection | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<DualCardSection | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<DualCardFormState>({
    cards: [],
    isActive: true,
  });

  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/dual-card-sections`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSections(data.data || []);
      } else {
        toast.error('Failed to fetch dual card sections');
      }
    } catch {
      toast.error('An error occurred while fetching sections');
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleFormChange = (field: keyof DualCardFormState, value: DualCard[] | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openModal = () => {
    setForm({
      cards: [createCard(), createCard()],
      isActive: true,
    });
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const openEditModal = (section: DualCardSection) => {
    setForm({
      cards: section.cards || [],
      isActive: section.isActive,
    });
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setForm({ cards: [], isActive: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.cards.length === 0) {
      toast.error('At least one card is required');
      return;
    }

    for (const card of form.cards) {
      if (!card.src || !card.label) {
        toast.error('Each card requires an image and label');
        return;
      }
    }

    setIsSaving(true);
    try {
      const url = editingSection
        ? `${API_BASE}/api/v1/dual-card-sections/${editingSection.id}`
        : `${API_BASE}/api/v1/dual-card-sections`;

      const response = await fetch(url, {
        method: editingSection ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success(editingSection ? 'Section updated successfully' : 'Section created successfully');
        closeModal();
        fetchSections();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save section');
      }
    } catch {
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (section: DualCardSection) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/dual-card-sections/${section.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Section deleted successfully');
        fetchSections();
        setSectionToDelete(null);
        setShowDeleteConfirm(false);
      } else {
        toast.error('Failed to delete section');
      }
    } catch {
      toast.error('An error occurred while deleting');
    }
  };

  const handleToggleStatus = async (section: DualCardSection) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/dual-card-sections/${section.id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Section ${data.data.isActive ? 'activated' : 'deactivated'} successfully`);
        fetchSections();
      } else {
        toast.error('Failed to toggle status');
      }
    } catch {
      toast.error('An error occurred while toggling');
    }
  };

  const handleReorder = async (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex((s) => s.id === sectionId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sections.length - 1)
    ) {
      return;
    }

    const newOrder = [...sections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const temp = newOrder[currentIndex].order;
    newOrder[currentIndex].order = newOrder[targetIndex].order;
    newOrder[targetIndex].order = temp;
    newOrder.sort((a, b) => a.order - b.order);

    try {
      const orders = newOrder.map((s, i) => ({ id: s.id, order: i }));
      const response = await fetch(`${API_BASE}/api/v1/dual-card-sections/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orders }),
      });

      if (response.ok) {
        setSections(newOrder);
        toast.success('Sections reordered successfully');
      } else {
        toast.error('Failed to reorder');
        fetchSections();
      }
    } catch {
      toast.error('An error occurred while reordering');
      fetchSections();
    }
  };

  const handleCardImageUpload = async (cardIndex: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${API_BASE}/api/v1/upload/dual-card`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.data?.url || data.url;
          const newCards = [...form.cards];
          newCards[cardIndex] = { ...newCards[cardIndex], src: imageUrl };
          handleFormChange('cards', newCards);
          toast.success('Image uploaded');
        } else {
          toast.error('Failed to upload image');
        }
      } catch {
        toast.error('Error uploading image');
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  const updateCardField = (cardIndex: number, field: keyof DualCard, value: string) => {
    const newCards = [...form.cards];
    newCards[cardIndex] = { ...newCards[cardIndex], [field]: value };
    handleFormChange('cards', newCards);
  };

  return {
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
  };
}
