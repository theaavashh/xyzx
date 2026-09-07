'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';
import type {
  EditorialSection,
  EditorialSectionFormData,
  ProductItem,
  ProductImage,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

const INITIAL_FORM: EditorialSectionFormData = {
  season: '',
  title: '',
  description: '',
  ctaText: '',
  ctaLink: '',
  featureType: '',
  isActive: true,
};

type FormErrors = Partial<Record<keyof EditorialSectionFormData, string>>;

const INITIAL_ERRORS: FormErrors = {};

export function useEditorialSectionQueries() {
  const [sections, setSections] = useState<EditorialSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<EditorialSection | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<EditorialSection | null>(null);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [fetchedProducts, setFetchedProducts] = useState<ProductItem[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<EditorialSectionFormData>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>(INITIAL_ERRORS);

  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/editorial-sections`, { credentials: 'include', headers: authHeaders() });
      if (response.ok) {
        const data = await response.json();
        setSections(data.data || []);
      } else {
        toast.error('Failed to fetch editorial sections');
      }
    } catch {
      toast.error('An error occurred while fetching sections');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleFormChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof EditorialSectionFormData]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const fetchProductsByFeature = async (feature: string) => {
    if (!feature) return;
    setIsFetchingProducts(true);
    setFetchedProducts([]);
    setSelectedProductIds(new Set());
    try {
      const response = await fetch(`${API_BASE}/api/v1/products?${feature}=true&limit=50`, { credentials: 'include', headers: authHeaders() });
      if (response.ok) {
        const data = await response.json();
        const products: ProductItem[] = data.data || [];
        setFetchedProducts(products);
        if (products.length === 0) toast('No products found for this feature');
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (err) {
      clientLogger.error('Error fetching products:', err);
      toast.error('Failed to fetch products');
    } finally {
      setIsFetchingProducts(false);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        if (next.size >= 4) {
          toast.error('Maximum 4 products');
          return prev;
        }
        next.add(productId);
      }
      return next;
    });
  };

  const openModal = () => {
    setForm(INITIAL_FORM);
    setFormErrors(INITIAL_ERRORS);
    setFetchedProducts([]);
    setSelectedProductIds(new Set());
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const openEditModal = (section: EditorialSection) => {
    setForm({
      season: section.season,
      title: section.title,
      description: section.description || '',
      ctaText: section.ctaText || '',
      ctaLink: section.ctaLink || '',
      featureType: section.featureType || '',
      isActive: section.isActive,
    });
    setFormErrors(INITIAL_ERRORS);
    setFetchedProducts([]);
    setSelectedProductIds(new Set(section.productIds || []));
    setEditingSection(section);
    setIsModalOpen(true);
    if (section.featureType) fetchProductsByFeature(section.featureType);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setFetchedProducts([]);
    setSelectedProductIds(new Set());
    setForm(INITIAL_FORM);
    setFormErrors(INITIAL_ERRORS);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FormErrors = {};
    if (!form.season.trim()) errors.season = 'Season is required';
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.featureType) errors.featureType = 'Product feature is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const payload = { ...form, productIds: Array.from(selectedProductIds) };

    try {
      const url = editingSection
        ? `${API_BASE}/api/v1/editorial-sections/${editingSection.id}`
        : `${API_BASE}/api/v1/editorial-sections`;

      const response = await fetch(url, {
        method: editingSection ? 'PUT' : 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingSection ? 'Section updated' : 'Section created');
        closeModal();
        fetchSections();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to save');
      }
    } catch {
      toast.error('An error occurred while saving');
    }
  };

  const handleDelete = async (section: EditorialSection) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/editorial-sections/${section.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders(),
      });
      if (response.ok) {
        toast.success('Deleted');
        fetchSections();
        setSectionToDelete(null);
        setShowDeleteConfirm(false);
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleToggleStatus = async (section: EditorialSection) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/editorial-sections/${section.id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
        headers: authHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.data.isActive ? 'Activated' : 'Deactivated');
        fetchSections();
      }
    } catch {
      toast.error('Failed to toggle');
    }
  };

  const handleReorder = async (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex((s) => s.id === sectionId);
    if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === sections.length - 1)) return;
    const newOrder = [...sections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newOrder[currentIndex].order, newOrder[targetIndex].order] = [newOrder[targetIndex].order, newOrder[currentIndex].order];
    newOrder.sort((a, b) => a.order - b.order);
    try {
      const orders = newOrder.map((s, i) => ({ id: s.id, order: i }));
      const response = await fetch(`${API_BASE}/api/v1/editorial-sections/reorder`, {
        method: 'PATCH',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({ orders }),
      });
      if (response.ok) {
        setSections(newOrder);
      } else {
        fetchSections();
      }
    } catch {
      fetchSections();
    }
  };

  const getProductThumb = (product: ProductItem): string =>
    product.thumbnail || (Array.isArray(product.images) && product.images.length > 0
      ? typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as ProductImage).src
      : '');

  return {
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
    formErrors,
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
  };
}
