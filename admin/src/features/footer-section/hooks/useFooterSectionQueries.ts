'use client';

import { clientLogger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type {
  FooterSection,
  FooterSectionLink,
  FooterSectionLinkFormData,
} from '../types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export function useFooterSectionQueries() {
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<FooterSection | null>(
    null,
  );
  const [sectionForm, setSectionForm] = useState<Partial<FooterSection>>({
    title: '',
    order: 0,
    isActive: true,
    links: [],
  });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sectionToDelete, setSectionToDelete] =
    useState<FooterSection | null>(null);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(
    null,
  );
  const [linkForm, setLinkForm] = useState<FooterSectionLinkFormData>({
    name: '',
    href: '',
    order: 0,
  });

  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/footer-section`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSections(data.data || []);
      } else {
        toast.error('Failed to fetch footer sections');
      }
    } catch (error) {
      clientLogger.error('Error fetching footer sections:', error);
      toast.error('Failed to fetch footer sections');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const openSectionModal = (item?: FooterSection) => {
    if (item) {
      setSectionForm({ ...item });
      setEditingSection(item);
    } else {
      setSectionForm({
        title: '',
        order: sections.length,
        isActive: true,
        links: [],
      });
      setEditingSection(null);
    }
    setIsSectionModalOpen(true);
  };

  const closeSectionModal = () => {
    setIsSectionModalOpen(false);
    setEditingSection(null);
    setSectionForm({
      title: '',
      order: 0,
      isActive: true,
      links: [],
    });
  };

  const handleSectionFormChange = (
    field: string,
    value: string | boolean | number,
  ) => {
    setSectionForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingSection
        ? `${API_BASE}/api/v1/footer-section/${editingSection.id}`
        : `${API_BASE}/api/v1/footer-section`;
      const response = await fetch(url, {
        method: editingSection ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(sectionForm),
      });
      if (response.ok) {
        toast.success(
          editingSection
            ? 'Footer section updated successfully'
            : 'Footer section created successfully',
        );
        closeSectionModal();
        fetchSections();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save footer section');
      }
    } catch (error) {
      clientLogger.error('Error saving footer section:', error);
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!sectionToDelete) return;
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/footer-section/${sectionToDelete.id}`,
        { method: 'DELETE', credentials: 'include' },
      );
      if (response.ok) {
        toast.success('Footer section deleted successfully');
        fetchSections();
        setSectionToDelete(null);
        setShowDeleteConfirm(false);
      } else {
        toast.error('Failed to delete footer section');
      }
    } catch (error) {
      clientLogger.error('Error deleting footer section:', error);
      toast.error('Failed to delete footer section');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/footer-section/${id}/toggle`,
        { method: 'PATCH', credentials: 'include' },
      );
      if (response.ok) {
        toast.success('Status updated successfully');
        fetchSections();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      clientLogger.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleReorder = async (itemId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex((item) => item.id === itemId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sections.length - 1)
    ) {
      return;
    }
    const newOrder = [...sections];
    const targetIndex =
      direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const tempOrder = newOrder[currentIndex].order;
    newOrder[currentIndex].order = newOrder[targetIndex].order;
    newOrder[targetIndex].order = tempOrder;
    newOrder.sort((a, b) => a.order - b.order);
    try {
      const orders = newOrder.map((item, index) => ({
        id: item.id,
        order: index,
      }));
      const response = await fetch(
        `${API_BASE}/api/v1/footer-section/reorder`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ orders }),
        },
      );
      if (response.ok) {
        setSections(newOrder);
        toast.success('Footer sections reordered successfully');
      } else {
        toast.error('Failed to reorder items');
        fetchSections();
      }
    } catch (error) {
      clientLogger.error('Error reordering:', error);
      toast.error('Failed to reorder items');
      fetchSections();
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openLinkModal = (linkIndex?: number) => {
    if (linkIndex !== undefined) {
      const link = sectionForm.links?.[linkIndex];
      if (link) {
        setLinkForm({ name: link.name, href: link.href, order: link.order });
        setEditingLinkIndex(linkIndex);
      }
    } else {
      setLinkForm({ name: '', href: '', order: (sectionForm.links || []).length });
      setEditingLinkIndex(null);
    }
    setIsLinkModalOpen(true);
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    setEditingLinkIndex(null);
    setLinkForm({ name: '', href: '', order: 0 });
  };

  const saveLink = () => {
    if (!linkForm.name || !linkForm.href) {
      toast.error('Name and URL are required');
      return;
    }
    setSectionForm((prev) => {
      const links = [...(prev.links || [])];
      if (editingLinkIndex !== null) {
        links[editingLinkIndex] = { ...links[editingLinkIndex], ...linkForm };
      } else {
        links.push({ ...linkForm });
      }
      return { ...prev, links };
    });
    closeLinkModal();
  };

  const removeLink = (linkIndex: number) => {
    setSectionForm((prev) => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== linkIndex),
    }));
  };

  const handleLinkFormChange = (field: string, value: string) => {
    setLinkForm((prev) => ({ ...prev, [field]: value }));
  };

  return {
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
    fetchSections,
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
  };
}
