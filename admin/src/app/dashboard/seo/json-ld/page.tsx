'use client';

import {
  Building2, Check, Code, Copy, FileText, Globe,
  Package, Plus, RefreshCw, Save, Search, ShoppingBag,
  Star, Tag, Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useJsonLdQueries } from '@/features/seo';
import type { JsonLdScript } from '@/features/seo';

const DEFAULT_TYPES = [
  { value: 'Organization', label: 'Organization', icon: Building2 },
  { value: 'WebSite', label: 'WebSite', icon: Globe },
  { value: 'Product', label: 'Product', icon: ShoppingBag },
  { value: 'Article', label: 'Article', icon: FileText },
  { value: 'BreadcrumbList', label: 'Breadcrumbs', icon: Search },
  { value: 'FAQPage', label: 'FAQ Page', icon: FileText },
  { value: 'LocalBusiness', label: 'Local Business', icon: Building2 },
  { value: 'Review', label: 'Review', icon: Star },
  { value: 'Event', label: 'Event', icon: Globe },
  { value: 'VideoObject', label: 'Video', icon: Globe },
];

const DEFAULT_PAGES = [
  { value: 'global', label: 'All Pages' },
  { value: '/', label: 'Homepage' },
  { value: '/products', label: 'Products Page' },
  { value: '/products/*', label: 'All Product Pages' },
  { value: '/categories', label: 'Categories' },
  { value: '/about', label: 'About Page' },
  { value: '/contact', label: 'Contact Page' },
  { value: '/blog', label: 'Blog' },
  { value: '/cart', label: 'Cart' },
  { value: '/checkout', label: 'Checkout' },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Organization: Building2, WebSite: Globe, Product: ShoppingBag,
  Article: FileText, BreadcrumbList: Search, Review: Star,
  FAQPage: FileText, LocalBusiness: Building2, Event: Globe,
  VideoObject: Globe,
};

const iconToType = (icon: React.ElementType): React.ElementType => icon;

const generateDefaultContent = (type: string): string => {
  const templates: Record<string, object> = {
    Organization: {
      '@context': 'https://schema.org', '@type': 'Organization',
      name: 'Your Organization Name', url: 'https://yourwebsite.com',
      logo: 'https://yourwebsite.com/logo.png',
    },
    WebSite: {
      '@context': 'https://schema.org', '@type': 'WebSite',
      name: 'Your Website Name', url: 'https://yourwebsite.com',
    },
    Product: {
      '@context': 'https://schema.org', '@type': 'Product',
      name: 'Product Name', description: 'Product description',
      offers: { '@type': 'Offer', priceCurrency: 'USD', price: '0.00', availability: 'https://schema.org/InStock' },
    },
    Article: {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: 'Article Title', datePublished: new Date().toISOString(),
      author: { '@type': 'Person', name: 'Author Name' },
    },
    BreadcrumbList: {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [],
    },
    FAQPage: {
      '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [],
    },
    LocalBusiness: {
      '@context': 'https://schema.org', '@type': 'LocalBusiness',
      name: 'Business Name', address: { '@type': 'PostalAddress', streetAddress: '123 Main St', addressLocality: 'City' },
    },
  };
  return JSON.stringify(templates[type] || templates.Organization, null, 2);
};

export default function JsonLdPage() {
  const { loading, fetchScripts, createScript, updateScript, deleteScript, fetchTypes, fetchPages } = useJsonLdQueries();
  const [activeTab, setActiveTab] = useState<'visual' | 'editor'>('visual');
  const [scripts, setScripts] = useState<JsonLdScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<JsonLdScript | null>(null);
  const [copied, setCopied] = useState(false);
  const [editingContent, setEditingContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [scriptTypes, setScriptTypes] = useState<Array<{ value: string; label: string; icon: React.ElementType }>>(DEFAULT_TYPES);
  const [pageOptions, setPageOptions] = useState(DEFAULT_PAGES);

  const [newScript, setNewScript] = useState<{
    name: string; type: string; page: string; content: string;
  }>({ name: '', type: 'Organization', page: 'global', content: '' });

  useEffect(() => {
    (async () => {
      const [data, types, pages] = await Promise.all([
        fetchScripts(),
        fetchTypes(),
        fetchPages(),
      ]);
      if (data.length > 0) setScripts(data);
      if (types.length > 0) {
        setScriptTypes(types.map((t) => ({
          value: t, label: t.replace(/([A-Z])/g, ' $1').trim(),
          icon: ICON_MAP[t] || Code,
        })));
      }
      if (pages.length > 0) {
        setPageOptions(pages.map((p) => ({ value: p, label: p === '/' ? 'Homepage' : p === 'global' ? 'All Pages' : p })));
      }
    })();
  }, [fetchScripts, fetchTypes, fetchPages]);

  const getContent = (script: JsonLdScript): string =>
    typeof script.schema === 'string' ? script.schema : JSON.stringify(script.schema, null, 2);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const script of scripts) {
        const payload = {
          name: script.name,
          type: script.type,
          page: script.page,
          schema: typeof script.schema === 'string' ? JSON.parse(script.schema) : script.schema,
          isActive: script.isActive,
          priority: script.priority ?? 0,
        };
        await updateScript(script.id, payload);
      }
      toast.success('All scripts saved');
    } catch {
      toast.error('Failed to save scripts');
    } finally {
      setSaving(false);
    }
  };

  const handleAddScript = async () => {
    if (!newScript.name) {
      toast.error('Please enter a script name');
      return;
    }
    let schema: Record<string, unknown>;
    try {
      schema = JSON.parse(newScript.content || generateDefaultContent(newScript.type));
    } catch {
      toast.error('Invalid JSON content');
      return;
    }

    const created = await createScript({
      name: newScript.name,
      type: newScript.type,
      page: newScript.page,
      schema,
      isActive: true,
      priority: 0,
    });

    if (created) {
      setScripts((prev) => [...prev, created]);
      setNewScript({ name: '', type: 'Organization', page: 'global', content: '' });
    }
  };

  const handleUpdateScript = async () => {
    if (!selectedScript) return;
    let schema: Record<string, unknown>;
    try {
      schema = JSON.parse(editingContent);
    } catch {
      toast.error('Invalid JSON content');
      return;
    }

    const updated = await updateScript(selectedScript.id, {
      ...selectedScript,
      schema,
    });

    if (updated) {
      setScripts((prev) => prev.map((s) => (s.id === selectedScript.id ? updated : s)));
      setSelectedScript(null);
      setIsEditing(false);
    }
  };

  const handleDeleteScript = async (id: string) => {
    const ok = await deleteScript(id);
    if (ok) {
      setScripts((prev) => prev.filter((s) => s.id !== id));
      if (selectedScript?.id === id) {
        setSelectedScript(null);
        setIsEditing(false);
      }
    }
  };

  const handleToggleScript = async (id: string) => {
    const script = scripts.find((s) => s.id === id);
    if (!script) return;
    const updated = await updateScript(id, { isActive: !script.isActive });
    if (updated) {
      setScripts((prev) => prev.map((s) => (s.id === id ? updated : s)));
    }
  };

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  const validateJson = (json: string): boolean => {
    try { JSON.parse(json); return true; } catch { return false; }
  };

  const getTypeIcon = (type: string) => {
    const typeDef = scriptTypes.find((t) => t.value === type);
    const Icon = typeDef?.icon || Code;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <DashboardLayout title="JSON-LD Structured Data">
      <div className="space-y-2 max-w-7xl">
        <div className="rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black outer-sans">JSON-LD Management</h1>
              <p className="text-black text-lg mt-2">Manage your JSON-LD structured data</p>
            </div>
            <div className="flex space-x-2">
              <button type="button" onClick={() => setActiveTab('visual')}
                className={`px-4 py-2.5 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all outer-sans ${activeTab === 'visual' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>Visual Editor</button>
              <button type="button" onClick={() => setActiveTab('editor')}
                className={`px-4 py-2.5 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all outer-sans ${activeTab === 'editor' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>JSON Editor</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div><h3 className="text-sm font-medium text-gray-500">Total Scripts</h3><p className="text-2xl font-bold text-black">{scripts.length}</p></div>
              <Code className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div><h3 className="text-sm font-medium text-gray-500">Active</h3><p className="text-2xl font-bold text-black">{scripts.filter((s) => s.isActive).length}</p></div>
              <RefreshCw className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div><h3 className="text-sm font-medium text-gray-500">Schema Types</h3><p className="text-2xl font-bold text-black">{new Set(scripts.map((s) => s.type)).size}</p></div>
              <Package className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div><h3 className="text-sm font-medium text-gray-500">Status</h3><p className="text-sm font-bold text-black">{scripts.every((s) => validateJson(getContent(s))) ? 'All Valid' : 'Invalid JSON'}</p></div>
              <Check className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
        </div>

        {activeTab === 'visual' ? (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-black outer-sans mb-4">{isEditing ? 'Edit Script' : 'Add New Script'}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="script-name" className="block text-sm font-medium text-black mb-1">Script Name</label>
                    <input id="script-name" type="text"
                      value={isEditing ? selectedScript?.name : newScript.name}
                      onChange={(e) => {
                        if (isEditing && selectedScript) setSelectedScript({ ...selectedScript, name: e.target.value });
                        else setNewScript({ ...newScript, name: e.target.value });
                      }}
                      placeholder="e.g., Organization Schema"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black placeholder:text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="script-type" className="block text-sm font-medium text-black mb-1">Schema Type</label>
                    <select id="script-type"
                      value={isEditing ? selectedScript?.type : newScript.type}
                      onChange={(e) => {
                        const type = e.target.value;
                        if (isEditing && selectedScript) setSelectedScript({ ...selectedScript, type });
                        else setNewScript({ ...newScript, type, content: generateDefaultContent(type) });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black"
                    >
                      {scriptTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apply to Page</label>
                  <select
                    value={isEditing ? selectedScript?.page : newScript.page}
                    onChange={(e) => {
                      if (isEditing && selectedScript) setSelectedScript({ ...selectedScript, page: e.target.value });
                      else setNewScript({ ...newScript, page: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                  >
                    {pageOptions.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">JSON-LD Content</label>
                  <textarea
                    value={isEditing ? editingContent : newScript.content}
                    onChange={(e) => {
                      if (isEditing) setEditingContent(e.target.value);
                      else setNewScript({ ...newScript, content: e.target.value });
                    }}
                    placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                    className={`w-full h-48 p-4 font-mono text-sm border rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black placeholder:text-black ${((isEditing ? editingContent : newScript.content)) && !validateJson(isEditing ? editingContent : newScript.content) ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                    spellCheck={false}
                  />
                  {(isEditing ? editingContent : newScript.content) && !validateJson(isEditing ? editingContent : newScript.content) && (
                    <p className="mt-1 text-sm text-red-600">Invalid JSON format</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button type="button" onClick={handleUpdateScript}
                        disabled={!selectedScript || !validateJson(editingContent)}
                        className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">Update Script</button>
                      <button type="button" onClick={() => { setIsEditing(false); setSelectedScript(null); }}
                        className="px-4 py-2.5 bg-gray-200 text-black rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">Cancel</button>
                    </>
                  ) : (
                    <button type="button" onClick={handleAddScript}
                      disabled={!newScript.name || !validateJson(newScript.content || generateDefaultContent(newScript.type))}
                      className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8962e] disabled:opacity-50 font-medium">Add Script</button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-black outer-sans">JSON-LD Scripts ({scripts.length})</h2>
                <button type="button" onClick={handleSave} disabled={loading || saving}
                  className="flex items-center px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">
                  <Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save All'}
                </button>
              </div>
              <div className="space-y-3">
                {scripts.map((script) => {
                  const content = getContent(script);
                  return (
                    <div key={script.id} className={`p-4 rounded-lg border ${script.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${script.isActive ? 'bg-blue-100' : 'bg-gray-200'}`}>{getTypeIcon(script.type)}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{script.name}</h3>
                            <p className="text-sm text-gray-500">Type: {script.type} | Page: {script.page}</p>
                            {!validateJson(content) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">Invalid JSON</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button type="button" onClick={() => handleToggleScript(script.id)}
                            className={`px-3 py-1 text-sm rounded-lg font-medium ${script.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{script.isActive ? 'Active' : 'Inactive'}</button>
                          <button type="button" onClick={() => handleCopyToClipboard(content)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Copy JSON">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button type="button" onClick={() => { setSelectedScript(script); setEditingContent(content); setIsEditing(true); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                            <Code className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => handleDeleteScript(script.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {scripts.length === 0 && (
                  <p className="text-center text-gray-400 py-8">No scripts yet. Add one above.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-black outer-sans">JSON Editor</h2>
              <div className="flex space-x-2">
                <button type="button" onClick={() => handleCopyToClipboard(JSON.stringify(scripts.map((s) => ({ ...s, schema: typeof s.schema === 'string' ? JSON.parse(s.schema) : s.schema })), null, 2))}
                  className="flex items-center px-3 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}Copy All
                </button>
                <button type="button" onClick={handleSave} disabled={loading || saving}
                  className="flex items-center px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">
                  <Save className="w-4 h-4 mr-1" />{saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            <textarea
              value={JSON.stringify(scripts.map((s) => ({ ...s, schema: typeof s.schema === 'string' ? JSON.parse(s.schema) : s.schema })), null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  if (Array.isArray(parsed)) setScripts(parsed);
                } catch { /* ignore */ }
              }}
              className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black"
              spellCheck={false}
            />
          </div>
        )}

        <div className="bg-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20 p-4">
          <h2 className="text-lg font-bold text-black outer-sans mb-4">JSON-LD Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black">
            <div>
              <h3 className="font-semibold mb-2">Common Schema Types:</h3>
              <ul className="list-disc list-inside space-y-1 opacity-75">
                <li><strong>Organization</strong> - Business/organization info</li>
                <li><strong>WebSite</strong> - Site info including search</li>
                <li><strong>Product</strong> - Product details, price, availability</li>
                <li><strong>Article</strong> - Blog posts, news articles</li>
                <li><strong>BreadcrumbList</strong> - Navigation breadcrumbs</li>
                <li><strong>Review/Rating</strong> - Product reviews and ratings</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Best Practices:</h3>
              <ul className="list-disc list-inside space-y-1 opacity-75">
                <li>Always include @context and @type properties</li>
                <li>Use valid Schema.org types and properties</li>
                <li>Keep JSON valid and well-formatted</li>
                <li>Test with Google&apos;s Rich Results Test tool</li>
                <li>Don&apos;t include sensitive or private information</li>
                <li>Use specific types rather than generic ones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
