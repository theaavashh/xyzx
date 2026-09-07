'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Edit, Eye, EyeOff, FileText, Globe, Plus, Search, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { useContentPagesQueries } from '@/features/content';
import type { ContentPage } from '@/features/content';

const PREDEFINED_SLUGS = [
  { slug: 'cookie-policy', label: 'Cookie Policy' },
  { slug: 'shipping-delivery', label: 'Shipping & Delivery' },
  { slug: 'terms-of-use', label: 'Terms of Use' },
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'order-cancellation', label: 'Order Cancellation' },
  { slug: 'contact-us', label: 'Contact Us' },
  { slug: 'faq', label: 'FAQ' },
  { slug: 'returns-exchanges', label: 'Returns & Exchanges' },
  { slug: 'size-guide', label: 'Size Guide' },
  { slug: 'about', label: 'About Us' },
];

export default function ContentPagesPage() {
  const { isLoading, fetchPages, updatePage, createPage, deletePage, togglePageStatus } = useContentPagesQueries();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<ContentPage | null>(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    isActive: true,
  });

  const [createForm, setCreateForm] = useState({
    slug: '',
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
  });

  const loadPages = useCallback(async () => {
    const data = await fetchPages();
    setPages(data);
  }, [fetchPages]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openEditModal = (page: ContentPage) => {
    setEditingPage(page);
    setForm({
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      isActive: page.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
    setForm({ title: '', content: '', metaTitle: '', metaDescription: '', isActive: true });
  };

  const openCreateModal = () => {
    setCreateForm({ slug: '', title: '', content: '', metaTitle: '', metaDescription: '' });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm({ slug: '', title: '', content: '', metaTitle: '', metaDescription: '' });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    const success = await updatePage(editingPage.slug, form);
    if (success) { closeModal(); loadPages(); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createPage(createForm);
    if (success) { closeCreateModal(); loadPages(); }
  };

  const handleDelete = async (page: ContentPage) => {
    const success = await deletePage(page.slug);
    if (success) { loadPages(); setPageToDelete(null); setShowDeleteConfirm(false); }
  };

  const handleToggleStatus = async (page: ContentPage) => {
    const success = await togglePageStatus(page.slug);
    if (success) loadPages();
  };

  const getPageUrl = (slug: string) => {
    const urlMap: Record<string, string> = {
      'cookie-policy': '/cookie-policy',
      'shipping-delivery': '/shipping',
      'terms-of-use': '/terms-of-service',
      'privacy-policy': '/privacy-policy',
      'order-cancellation': '/refund',
      'contact-us': '/contact-us',
      faq: '/faq',
      'returns-exchanges': '/returns-exchanges',
      'size-guide': '/size-guide',
      about: '/about',
    };
    return urlMap[slug] || `/${slug}`;
  };

  return (
    <DashboardLayout title="Content Pages">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Content Pages</h1>
            <p className="text-gray-600 mt-1">Manage website content pages including policies, FAQs, and informational pages</p>
          </div>
          <button type="button" onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#b8962e] transition-colors w-fit">
            <Plus className="w-4 h-4" /> Add Page
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search pages..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
                <p className="text-gray-600 mb-4">{searchTerm ? 'Try adjusting your search' : 'Get started by creating your first content page'}</p>
                {!searchTerm && (
                  <button type="button" onClick={openCreateModal}
                    className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#b8962e] transition-colors">
                    <Plus className="w-4 h-4" /> Create Page
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPages.map((page) => (
                  <motion.div key={page.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{page.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${page.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {page.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Slug: {page.slug}</p>
                        <p className="text-sm text-gray-500">Last updated: {new Date(page.updatedAt).toLocaleDateString()}</p>
                        {page.metaTitle && <p className="text-xs text-gray-400 mt-1">Meta: {page.metaTitle}</p>}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <a href={`${process.env.NEXT_PUBLIC_WEB_URL}${getPageUrl(page.slug)}`} target="_blank" rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="View page">
                          <Globe className="w-4 h-4" />
                        </a>
                        <button type="button" onClick={() => openEditModal(page)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleToggleStatus(page)}
                          className={`p-2 rounded-lg transition-colors ${page.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                          title={page.isActive ? 'Deactivate' : 'Activate'}>
                          {page.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button type="button" onClick={() => { setPageToDelete(page); setShowDeleteConfirm(true); }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && editingPage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-black">Edit Content Page</h2>
                  <button type="button" onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} placeholder="Enter page content..." height={400} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (SEO)</label>
                    <input type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Page title for search engines" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
                    <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                      rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Page description for search engines" />
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="isActive" checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (visible on website)</label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#b8962e] transition-colors">Update Page</button>
                    <button type="button" onClick={closeModal} className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeCreateModal}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-black">Create Content Page</h2>
                  <button type="button" onClick={closeCreateModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Type</label>
                    <select value={createForm.slug} onChange={(e) => {
                      const selected = PREDEFINED_SLUGS.find((p) => p.slug === e.target.value);
                      if (selected) setCreateForm({ ...createForm, slug: selected.slug, title: selected.label });
                    }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                      <option value="">Select a page type</option>
                      {PREDEFINED_SLUGS.map((option) => (<option key={option.slug} value={option.slug}>{option.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <RichTextEditor value={createForm.content} onChange={(content) => setCreateForm({ ...createForm, content })} placeholder="Enter page content..." height={400} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (SEO)</label>
                    <input type="text" value={createForm.metaTitle} onChange={(e) => setCreateForm({ ...createForm, metaTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Page title for search engines" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
                    <textarea value={createForm.metaDescription} onChange={(e) => setCreateForm({ ...createForm, metaDescription: e.target.value })}
                      rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Page description for search engines" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#b8962e] transition-colors">Create Page</button>
                    <button type="button" onClick={closeCreateModal} className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && pageToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Content Page</h3>
                <p className="text-gray-600 text-center mb-6">Are you sure you want to delete &quot;{pageToDelete.title}&quot;? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => handleDelete(pageToDelete)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Delete</button>
                  <button type="button" onClick={() => { setShowDeleteConfirm(false); setPageToDelete(null); }}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
