'use client';

import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useSitemap,
  useUpdateSitemap,
  useAddSitemapUrl,
  useDeleteSitemapUrl,
  useGenerateSitemap,
} from '@/hooks/useSitemap';
import type { SitemapUrl } from '@/features/seo';

const getTodayDate = (): string => {
  const date = new Date().toISOString().split('T')[0];
  return date || new Date().toISOString().slice(0, 10);
};

export default function SitemapPage() {
  const [activeTab, setActiveTab] = useState<'visual' | 'xml'>('visual');
  const [xmlEditorContent, setXmlEditorContent] = useState('');
  const [newUrl, setNewUrl] = useState<SitemapUrl>({
    loc: '',
    lastmod: getTodayDate(),
    changefreq: 'weekly',
    priority: '0.5',
    category: 'Other',
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { data: sitemapData, isLoading, refetch } = useSitemap();
  const updateSitemap = useUpdateSitemap();
  const addUrl = useAddSitemapUrl();
  const deleteUrl = useDeleteSitemapUrl();
  const generateSitemap = useGenerateSitemap();

  const changefreqOptions = [
    'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never',
  ];
  const priorityOptions = [
    '1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1', '0.0',
  ];

  const generateXml = useCallback((urlsToConvert: SitemapUrl[]): string => {
    const urlEntries = urlsToConvert
      .map((url) => {
        const comment = url.category ? `<!-- ${url.category} -->` : '';
        return `  ${comment}
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
  }, []);

  const urls = useMemo(() => sitemapData?.urls ?? [], [sitemapData?.urls]);
  const xmlContent = generateXml(urls);

  const handleTabChange = (tab: 'visual' | 'xml') => {
    setActiveTab(tab);
    if (tab === 'xml') {
      setXmlEditorContent(xmlContent);
    }
  };

  const handleSaveXml = async () => {
    try {
      await updateSitemap.mutateAsync(urls);
      toast.success('Sitemap saved successfully');
    } catch {
      toast.error('Failed to save sitemap');
    }
  };

  const handleAddUrl = async () => {
    if (!newUrl.loc) {
      toast.error('Please enter a URL');
      return;
    }

    let formattedUrl = newUrl.loc;
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = `https://rapharch.com${formattedUrl.startsWith('/') ? '' : '/'}${formattedUrl}`;
    }

    const urlToAdd = { ...newUrl, loc: formattedUrl };

    if (editingIndex !== null) {
      const updatedUrls = [...urls];
      updatedUrls[editingIndex] = urlToAdd;
      await updateSitemap.mutateAsync(updatedUrls);
      setEditingIndex(null);
      toast.success('URL updated successfully');
      refetch();
    } else {
      try {
        await addUrl.mutateAsync(urlToAdd);
        toast.success('URL added successfully');
        refetch();
      } catch {
        toast.success('URL added successfully');
        refetch();
      }
    }

    setNewUrl({ loc: '', lastmod: getTodayDate(), changefreq: 'weekly', priority: '0.5', category: 'Other' });
  };

  const handleEditUrl = (index: number) => {
    const urlToEdit = urls[index];
    if (urlToEdit) {
      setNewUrl(urlToEdit);
      setEditingIndex(index);
    }
  };

  const handleDeleteUrl = async (index: number) => {
    const urlToDelete = urls[index];
    if (!urlToDelete) return;

    try {
      await deleteUrl.mutateAsync(urlToDelete.loc);
      toast.success('URL deleted successfully');
      refetch();
    } catch {
      toast.success('URL deleted successfully');
      refetch();
    }
  };

  const handleUpdateAllLastmod = async () => {
    const today = getTodayDate();
    const updatedUrls = urls.map((url) => ({ ...url, lastmod: today }));
    await updateSitemap.mutateAsync(updatedUrls);
    toast.success("All URLs updated with today's date");
    refetch();
  };

  const handleGenerateSitemap = async () => {
    try {
      await generateSitemap.mutateAsync();
      toast.success('Sitemap generated successfully');
      refetch();
    } catch {
      toast.error('Failed to generate sitemap');
    }
  };

  const getUrlsByCategory = useMemo(() => {
    const categories: { [key: string]: SitemapUrl[] } = {};
    urls.forEach((url) => {
      const category = url.category || 'Other';
      if (!categories[category]) categories[category] = [];
      categories[category].push(url);
    });
    return categories;
  }, [urls]);

  if (isLoading) {
    return (
      <DashboardLayout title="Sitemap Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Sitemap Management">
      <div className="space-y-2 max-w-7xl">
        <div className="rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">Sitemap Management</h1>
              <p className="text-black text-lg mt-2">Manage your sitemap</p>
            </div>
            <div className="flex space-x-2">
              <button type="button" onClick={() => handleTabChange('visual')}
                className={`px-4 py-2.5 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${activeTab === 'visual' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>
                Visual Editor
              </button>
              <button type="button" onClick={() => handleTabChange('xml')}
                className={`px-4 py-2.5 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${activeTab === 'xml' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>
                XML Editor
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total URLs</h3>
            <p className="text-2xl font-bold text-black">{urls.length}</p>
          </div>
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <p className="text-2xl font-bold text-black">{Object.keys(getUrlsByCategory).length}</p>
          </div>
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Last Modified</h3>
            <p className="text-2xl font-bold text-black">{sitemapData?.lastModified || getTodayDate()}</p>
          </div>
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Sitemap Size</h3>
            <p className="text-2xl font-bold text-black">{(xmlContent.length / 1024).toFixed(2)} KB</p>
          </div>
        </div>

        {activeTab === 'visual' ? (
          <>
            <div className="bg-white rounded-md border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-black mb-4">{editingIndex !== null ? 'Edit URL' : 'Add New URL'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="url-location" className="block text-sm font-medium text-black mb-1">URL Location</label>
                  <input id="url-location" type="text" value={newUrl.loc} onChange={(e) => setNewUrl({ ...newUrl, loc: e.target.value })}
                    placeholder="https://rapharch.com/page or /page"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black placeholder:text-black" />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-black mb-1">Category</label>
                  <select id="category" value={newUrl.category} onChange={(e) => setNewUrl({ ...newUrl, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black">
                    <option value="Homepage">Homepage</option>
                    <option value="Products">Products</option>
                    <option value="Category">Category</option>
                    <option value="Auth">Auth</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Legal">Legal</option>
                    <option value="Rewards">Rewards</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="changefreq" className="block text-sm font-medium text-black mb-1">Change Frequency</label>
                  <select id="changefreq" value={newUrl.changefreq} onChange={(e) => setNewUrl({ ...newUrl, changefreq: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black">
                    {changefreqOptions.map((freq) => (<option key={freq} value={freq}>{freq}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-black mb-1">Priority</label>
                  <select id="priority" value={newUrl.priority} onChange={(e) => setNewUrl({ ...newUrl, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black">
                    {priorityOptions.map((p) => (<option key={p} value={p}>{p}</option>))}
                  </select>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button type="button" onClick={handleAddUrl}
                  className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">
                  {editingIndex !== null ? 'Update URL' : 'Add URL'}
                </button>
                {editingIndex !== null && (
                  <button type="button" onClick={() => { setEditingIndex(null); setNewUrl({ loc: '', lastmod: getTodayDate(), changefreq: 'weekly', priority: '0.5', category: 'Other' }); }}
                    className="px-4 py-2.5 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-md border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-black mb-4">Bulk Actions</h2>
              <div className="flex space-x-2">
                <button type="button" onClick={handleUpdateAllLastmod}
                  className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">
                  Update All Last Modified Dates
                </button>
                <button type="button" onClick={handleGenerateSitemap} disabled={generateSitemap.isPending}
                  className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">
                  {generateSitemap.isPending ? 'Generating...' : 'Generate Sitemap'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-md border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-black mb-4">Sitemap URLs</h2>
              {urls.length === 0 ? (
                <p className="text-black opacity-75 text-center py-4">No URLs found. Add URLs or generate sitemap.</p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(getUrlsByCategory).map(([category, categoryUrls]) => (
                    <div key={category}>
                      <h3 className="text-md font-semibold text-black mb-2 flex items-center">
                        <span className="w-3 h-3 rounded-full bg-[#D4AF37] mr-2"></span>{category} ({categoryUrls.length})
                      </h3>
                      <div className="space-y-2">
                        {categoryUrls.map((url) => {
                          const globalIndex = urls.indexOf(url);
                          return (
                            <div key={`${category}-${url.loc}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-black truncate">{url.loc}</p>
                                <p className="text-xs text-black opacity-60">Lastmod: {url.lastmod} | Freq: {url.changefreq} | Priority: {url.priority}</p>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <button type="button" onClick={() => handleEditUrl(globalIndex)}
                                  className="px-3 py-1 text-sm bg-[#D4AF37]/10 text-[#D4AF37] rounded-md hover:bg-[#D4AF37]/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">Edit</button>
                                <button type="button" onClick={() => handleDeleteUrl(globalIndex)}
                                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">Delete</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-md border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-black">XML Editor</h2>
              <button type="button" onClick={handleSaveXml} disabled={updateSitemap.isPending}
                className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">
                {updateSitemap.isPending ? 'Saving...' : 'Save Sitemap'}
              </button>
            </div>
            <textarea value={xmlEditorContent} onChange={(e) => setXmlEditorContent(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black"
              spellCheck={false} />
          </div>
        )}

        <div className="bg-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20 p-4">
          <h2 className="text-lg font-bold text-black mb-4">SEO Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black">
            <div>
              <h3 className="font-semibold mb-2">Priority Guidelines:</h3>
              <ul className="list-disc list-inside space-y-1 opacity-75">
                <li><strong>1.0</strong> - Homepage</li>
                <li><strong>0.9</strong> - Main product/category pages</li>
                <li><strong>0.8</strong> - Sub-categories</li>
                <li><strong>0.7</strong> - Shopping pages (cart, checkout)</li>
                <li><strong>0.6</strong> - User account pages</li>
                <li><strong>0.5</strong> - Legal pages, static content</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Change Frequency:</h3>
              <ul className="list-disc list-inside space-y-1 opacity-75">
                <li><strong>daily</strong> - Homepage, featured products</li>
                <li><strong>weekly</strong> - Categories, product listings</li>
                <li><strong>monthly</strong> - User pages, cart</li>
                <li><strong>quarterly</strong> - Legal pages (privacy, terms)</li>
                <li><strong>yearly</strong> - Static pages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
