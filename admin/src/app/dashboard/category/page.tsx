'use client';

import { AlertTriangle, FolderOpen, LayoutGrid, List, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { type CategoryFormData, validateCategoryForm } from '@/schemas/categorySchema';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useBulkStatusToggle,
  useBulkDeleteCategories,
  useUploadCategoryImage,
  getFullImageUrl,
  CategoryTable,
  CategoryForm,
  ImagePreviewModal,
  BulkDeleteModal,
  DeleteModal,
  CategoryPagination,
} from '@/features/categories';
import type { Category } from '@/features/categories';

export default function CategoryPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ id: string; name: string; type: 'category' | 'subcategory' } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'name' | 'status' | 'createdAt' | null>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const { data: categories = [], isLoading, error, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const bulkStatusToggle = useBulkStatusToggle();
  const bulkDelete = useBulkDeleteCategories();
  const uploadImage = useUploadCategoryImage();

  const pageError = error?.message ?? null;
  const isUploadingImage = uploadImage.isPending;

  const handleViewModeChange = (mode: 'list' | 'grid') => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  function getItemsPerPage(mode: 'list' | 'grid') {
    return mode === 'list' ? 15 : 9;
  }

  const form = useForm<CategoryFormData>({
    defaultValues: { name: '', image: '', internalLink: '', status: 'active', metaTitle: '', metaDescription: '', keywords: '' },
  });
  const { reset, setValue, setError, formState: { errors, isSubmitting } } = form;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select a valid image file'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image size must be less than 10MB'); return; }
    try {
      const url = await uploadImage.mutateAsync(file);
      setValue('image', url, { shouldValidate: false, shouldDirty: false });
    } catch {
      // toast handled by mutation onError
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    const validationErrors = validateCategoryForm(data);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => setError(field as keyof CategoryFormData, { type: 'manual', message }));
      return;
    }

    if (!data.image) { toast.error('Image is required'); return; }

    const formData: CategoryFormData = { name: data.name, image: data.image, internalLink: data.internalLink, status: data.status, metaTitle: data.metaTitle, metaDescription: data.metaDescription, keywords: data.keywords };

    if (editingCategory) {
      await updateCategory.mutateAsync({ id: editingCategory.id, data: formData });
      setShowEditModal(false);
      setEditingCategory(null);
      reset({ name: '', image: '', internalLink: '', status: 'active', metaTitle: '', metaDescription: '', keywords: '' });
    } else {
      await createCategory.mutateAsync(formData);
      setShowAddModal(false);
      reset({ name: '', image: '', internalLink: '', status: 'active', metaTitle: '', metaDescription: '', keywords: '' });
    }
  };

  const handleDeleteClick = (id: string, name: string, type: 'category' | 'subcategory') => { setDeleteItem({ id, name, type }); setShowDeleteModal(true); };
  const handleDeleteConfirm = async () => { if (!deleteItem) return; await deleteCategory.mutateAsync(deleteItem.id); setShowDeleteModal(false); setDeleteItem(null); };
  const handleDeleteCancel = () => { setShowDeleteModal(false); setDeleteItem(null); };
  const handleImagePreview = (imageUrl: string) => { if (imageUrl) { setPreviewImage(getFullImageUrl(imageUrl)); setShowImagePreview(true); } };
  const handleEditClick = (category: Category) => { setEditingCategory(category); setValue('name', category.name); setValue('image', category.image || ''); setValue('internalLink', category.internalLink || ''); setValue('status', category.status); setValue('metaTitle', category.metaTitle || ''); setValue('metaDescription', category.metaDescription || ''); setValue('keywords', category.keywords || ''); setShowEditModal(true); };
  const handleEditCancel = () => { setShowEditModal(false); setEditingCategory(null); reset({ name: '', image: '', internalLink: '', status: 'active', metaTitle: '', metaDescription: '', keywords: '' }); };
  const handleAddCancel = () => { setShowAddModal(false); reset({ name: '', image: '', internalLink: '', status: 'active', metaTitle: '', metaDescription: '', keywords: '' }); };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSort = (field: 'name' | 'status' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSelectionChange = (ids: string[]) => setSelectedIds(ids);

  const handleBulkStatusToggle = async () => {
    await bulkStatusToggle.mutateAsync({ ids: selectedIds, categories });
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    await bulkDelete.mutateAsync(selectedIds);
    setSelectedIds([]);
    setShowBulkDeleteModal(false);
  };

  const filteredCategories = categories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!sortField) return 0;
    const dir = sortDirection === 'asc' ? 1 : -1;
    const aVal = (a[sortField] || '').toLowerCase();
    const bVal = (b[sortField] || '').toLowerCase();
    return aVal.localeCompare(bVal) * dir;
  });
  const totalPages = Math.ceil(sortedCategories.length / getItemsPerPage(viewMode));
  const startIndex = (currentPage - 1) * getItemsPerPage(viewMode);
  const paginatedCategories = sortedCategories.slice(startIndex, startIndex + getItemsPerPage(viewMode));

  return (
    <DashboardLayout title="Category Management" showBackButton={true}>
      <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">Categories</h1>
              <p className="text-black text-lg mt-2">{categories.length} categories total</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} className="w-full sm:w-56 rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-black placeholder:text-gray-400 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition" />
            </div>
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm">
              <button
                onClick={() => handleViewModeChange('list')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === 'list'
                    ? 'bg-[#D4AF37] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                List
              </button>
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === 'grid'
                    ? 'bg-[#D4AF37] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Grid
              </button>
            </div>
            <button onClick={() => { reset({ name: '', image: '', internalLink: '', status: 'active', metaTitle: '', metaDescription: '', keywords: '' }); setShowAddModal(true); }} className="bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold whitespace-nowrap">
              <Plus className="w-4 h-4" /><span>Add</span>
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]" />
          </div>
        )}

        {pageError && !isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Error Loading Categories</h3>
              <p className="mt-1 text-sm text-gray-500">{pageError}</p>
              <button onClick={() => refetch()} className="mt-4 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#B8960C]">Try Again</button>
            </div>
          </div>
        )}

        {!isLoading && !pageError && filteredCategories.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto">
                <FolderOpen className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No Categories Found</h3>
              <p className="mt-1 text-sm text-gray-500">{searchTerm ? 'No categories match your search.' : 'Get started by creating your first category.'}</p>
            </div>
          </div>
        )}

        {!isLoading && !pageError && filteredCategories.length > 0 && (
          <div className="space-y-6">
            <CategoryTable
              categories={paginatedCategories}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              getFullImageUrl={getFullImageUrl}
              handleImagePreview={handleImagePreview}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onBulkDelete={() => setShowBulkDeleteModal(true)}
              onBulkStatusToggle={handleBulkStatusToggle}
            />
            <CategoryPagination currentPage={currentPage} totalPages={totalPages} startIndex={startIndex} itemsPerPage={getItemsPerPage(viewMode)} totalItems={filteredCategories.length} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {(showAddModal || editingCategory) && (
        <CategoryForm form={form} editingCategory={editingCategory ? { id: editingCategory.id, name: editingCategory.name } : null} isSubmitting={isSubmitting} isLoading={createCategory.isPending || updateCategory.isPending} isUploadingImage={isUploadingImage} onSubmit={onSubmit} onCancel={editingCategory ? handleEditCancel : handleAddCancel} handleImageUpload={handleImageUpload} getFullImageUrl={getFullImageUrl} />
      )}

      <ImagePreviewModal show={showImagePreview} imageUrl={previewImage} onClose={() => setShowImagePreview(false)} />

      <DeleteModal show={showDeleteModal} itemName={deleteItem?.name || ''} itemType={deleteItem?.type || 'category'} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />

      <BulkDeleteModal show={showBulkDeleteModal} count={selectedIds.length} onConfirm={handleBulkDelete} onCancel={() => setShowBulkDeleteModal(false)} />
      </ErrorBoundary>
    </DashboardLayout>
  );
}
