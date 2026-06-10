'use client';

import {
  Bot, Check, Copy, Eye, EyeOff, Plus, RefreshCw, Save, Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useRobotsQueries } from '@/features/seo';
import type { RobotRule, SitemapConfig } from '@/features/seo';

const defaultRobotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://rapharch.com/sitemap.xml

# Block AI crawlers (optional)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Block admin areas
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /favicon.ico
Disallow: /*.json$

# Allow specific paths for crawling
Allow: /products/
Allow: /categories/
Allow: /contact-us
Allow: /privacy-policy
Allow: /terms-of-use
Allow: /refund

# Crawl delay (optional - adjust based on server capacity)
Crawl-delay: 1`;

const commonUserAgents = [
  { value: '*', label: 'All Bots (*)' },
  { value: 'Googlebot', label: 'Googlebot' },
  { value: 'Googlebot-Image', label: 'Google Images' },
  { value: 'Bingbot', label: 'Bingbot' },
  { value: 'Slurp', label: 'Yahoo Slurp' },
  { value: 'DuckDuckBot', label: 'DuckDuckGo' },
  { value: 'Baiduspider', label: 'Baidu' },
  { value: 'YandexBot', label: 'Yandex' },
  { value: 'GPTBot', label: 'ChatGPT/GPTBot' },
  { value: 'ChatGPT-User', label: 'ChatGPT User' },
  { value: 'anthropic-ai', label: 'Anthropic AI' },
  { value: 'Claude-Web', label: 'Claude Web' },
  { value: 'CCBot', label: 'Common Crawl' },
];

const commonPaths = [
  { value: '/admin/', label: 'Admin Panel', type: 'disallow' },
  { value: '/api/', label: 'API Endpoints', type: 'disallow' },
  { value: '/_next/', label: 'Next.js Build', type: 'disallow' },
  { value: '/cart', label: 'Shopping Cart', type: 'disallow' },
  { value: '/checkout', label: 'Checkout', type: 'disallow' },
  { value: '/auth/', label: 'Auth Pages', type: 'disallow' },
  { value: '/*.json$', label: 'JSON Files', type: 'disallow' },
  { value: '/products/', label: 'Products', type: 'allow' },
  { value: '/categories/', label: 'Categories', type: 'allow' },
  { value: '/', label: 'Homepage', type: 'allow' },
];

export default function RobotsPage() {
  const { loading, fetchRobots, saveRobots } = useRobotsQueries();
  const [activeTab, setActiveTab] = useState<'visual' | 'editor'>('visual');
  const [robotsContent, setRobotsContent] = useState(defaultRobotsContent);
  const [rules, setRules] = useState<RobotRule[]>([]);
  const [sitemaps, setSitemaps] = useState<SitemapConfig[]>([
    { url: 'https://rapharch.com/sitemap.xml', enabled: true },
  ]);
  const [copied, setCopied] = useState(false);

  const [newRule, setNewRule] = useState<RobotRule>({
    userAgent: '*',
    allow: [],
    disallow: [],
  });

  const parseRobotsContent = useCallback((content: string) => {
    const lines = content.split('\n');
    const parsedRules: RobotRule[] = [];
    const parsedSitemaps: SitemapConfig[] = [];
    let currentRule: RobotRule | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;

      if (trimmedLine.toLowerCase().startsWith('user-agent:')) {
        if (currentRule) parsedRules.push(currentRule);
        const userAgent = trimmedLine.substring(11).trim();
        currentRule = { userAgent, allow: [], disallow: [] };
      } else if (trimmedLine.toLowerCase().startsWith('allow:')) {
        if (currentRule) currentRule.allow.push(trimmedLine.substring(6).trim());
      } else if (trimmedLine.toLowerCase().startsWith('disallow:')) {
        if (currentRule) currentRule.disallow.push(trimmedLine.substring(9).trim());
      } else if (trimmedLine.toLowerCase().startsWith('crawl-delay:')) {
        if (currentRule) {
          const delay = parseInt(trimmedLine.substring(12).trim());
          if (!isNaN(delay)) currentRule.crawlDelay = delay;
        }
      } else if (trimmedLine.toLowerCase().startsWith('sitemap:')) {
        parsedSitemaps.push({ url: trimmedLine.substring(8).trim(), enabled: true });
      }
    }

    if (currentRule) parsedRules.push(currentRule);
    setRules(parsedRules);
    if (parsedSitemaps.length > 0) setSitemaps(parsedSitemaps);
  }, []);

  const generateRobotsContent = useCallback((ruleList: RobotRule[], sitemapList: SitemapConfig[]): string => {
    let content = '# robots.txt for Rapharch\n# Generated: ' + new Date().toISOString() + '\n\n';
    sitemapList.filter((s) => s.enabled).forEach((sitemap) => { content += `Sitemap: ${sitemap.url}\n`; });
    content += '\n';
    ruleList.forEach((rule, index) => {
      if (index > 0) content += '\n';
      content += `User-agent: ${rule.userAgent}\n`;
      rule.allow.forEach((path) => { content += `Allow: ${path}\n`; });
      rule.disallow.forEach((path) => { content += `Disallow: ${path}\n`; });
      if (rule.crawlDelay !== undefined && rule.crawlDelay > 0) content += `Crawl-delay: ${rule.crawlDelay}\n`;
    });
    return content;
  }, []);

  useEffect(() => {
    (async () => {
      const content = await fetchRobots();
      if (content) {
        setRobotsContent(content);
        parseRobotsContent(content);
      } else {
        parseRobotsContent(defaultRobotsContent);
      }
    })();
  }, [fetchRobots, parseRobotsContent]);

  const handleSave = async () => {
    await saveRobots(robotsContent);
    parseRobotsContent(robotsContent);
  };

  const handleAddRule = () => {
    if (!newRule.userAgent) {
      toast.error('Please select a user agent');
      return;
    }
    const updatedRules = [...rules, { ...newRule }];
    setRules(updatedRules);
    setRobotsContent(generateRobotsContent(updatedRules, sitemaps));
    setNewRule({ userAgent: '*', allow: [], disallow: [] });
    toast.success('Rule added successfully');
  };

  const handleDeleteRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
    setRobotsContent(generateRobotsContent(updatedRules, sitemaps));
    toast.success('Rule deleted successfully');
  };

  const handleAddPath = (ruleIndex: number, path: string, type: 'allow' | 'disallow') => {
    const updatedRules = [...rules];
    const rule = updatedRules[ruleIndex];
    if (!rule) return;
    if (type === 'allow') { if (!rule.allow.includes(path)) rule.allow.push(path); }
    else { if (!rule.disallow.includes(path)) rule.disallow.push(path); }
    setRules(updatedRules);
    setRobotsContent(generateRobotsContent(updatedRules, sitemaps));
  };

  const handleRemovePath = (ruleIndex: number, path: string, type: 'allow' | 'disallow') => {
    const updatedRules = [...rules];
    const rule = updatedRules[ruleIndex];
    if (!rule) return;
    if (type === 'allow') rule.allow = rule.allow.filter((p) => p !== path);
    else rule.disallow = rule.disallow.filter((p) => p !== path);
    setRules(updatedRules);
    setRobotsContent(generateRobotsContent(updatedRules, sitemaps));
  };

  const handleAddSitemap = () => setSitemaps([...sitemaps, { url: '', enabled: true }]);

  const handleUpdateSitemap = (index: number, updates: Partial<SitemapConfig>) => {
    const updatedSitemaps = sitemaps.map((s, i) => (i === index ? { ...s, ...updates } : s));
    setSitemaps(updatedSitemaps);
    setRobotsContent(generateRobotsContent(rules, updatedSitemaps));
  };

  const handleDeleteSitemap = (index: number) => {
    const updatedSitemaps = sitemaps.filter((_, i) => i !== index);
    setSitemaps(updatedSitemaps);
    setRobotsContent(generateRobotsContent(rules, updatedSitemaps));
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(robotsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <DashboardLayout title="Robots.txt Management">
      <div className="space-y-2 max-w-7xl">
        <div className="rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black lastik">Robots.txt Management</h1>
              <p className="text-black text-lg mt-2">Manage your robots.txt file</p>
            </div>
            <div className="flex space-x-2">
              <button type="button" onClick={() => setActiveTab('visual')}
                className={`px-4 py-2.5 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all lastik ${activeTab === 'visual' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>
                Visual Editor
              </button>
              <button type="button" onClick={() => setActiveTab('editor')}
                className={`px-4 py-2.5 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all lastik ${activeTab === 'editor' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>
                Text Editor
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-black opacity-75">Total Rules</h3>
                <p className="text-2xl font-bold text-black">{rules.length}</p>
              </div>
              <Bot className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-black opacity-75">Sitemaps</h3>
                <p className="text-2xl font-bold text-black">{sitemaps.filter((s) => s.enabled).length}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-black opacity-75">File Size</h3>
                <p className="text-2xl font-bold text-black">{(robotsContent.length / 1024).toFixed(2)} KB</p>
              </div>
              <Save className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-black opacity-75">File URL</h3>
                <p className="text-sm font-bold text-black truncate">/robots.txt</p>
              </div>
              <button type="button" onClick={handleCopyToClipboard}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" title="Copy content">
                {copied ? <Check className="w-5 h-5 text-[#D4AF37]" /> : <Copy className="w-5 h-5 text-black opacity-50" />}
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'visual' ? (
          <>
            <div className="bg-white rounded-md border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-black lastik">Sitemaps</h2>
                <button type="button" onClick={handleAddSitemap}
                  className="flex items-center px-3 py-2 text-sm bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all">
                  <Plus className="w-4 h-4 mr-1" /> Add Sitemap
                </button>
              </div>
              <div className="space-y-3">
                {sitemaps.map((sitemap, index) => (
                  <div key={`sitemap-${index}-${sitemap.url}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <input type="checkbox" checked={sitemap.enabled} onChange={(e) => handleUpdateSitemap(index, { enabled: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
                    <input type="text" value={sitemap.url} onChange={(e) => handleUpdateSitemap(index, { url: e.target.value })}
                      placeholder="https://example.com/sitemap.xml"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black placeholder:text-black" />
                    <button type="button" onClick={() => handleDeleteSitemap(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-md border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-black lastik mb-4">Add New Rule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-agent" className="block text-sm font-medium text-black mb-1">User Agent</label>
                  <select id="user-agent" value={newRule.userAgent} onChange={(e) => setNewRule({ ...newRule, userAgent: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black">
                    {commonUserAgents.map((agent) => (<option key={agent.value} value={agent.value}>{agent.label}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="crawl-delay" className="block text-sm font-medium text-black mb-1">Crawl Delay (seconds)</label>
                  <input id="crawl-delay" type="number" min="0" value={newRule.crawlDelay || ''}
                    onChange={(e) => setNewRule({ ...newRule, crawlDelay: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black placeholder:text-black" />
                </div>
              </div>
              <div className="mt-4">
                <button type="button" onClick={handleAddRule}
                  className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">
                  Add Rule
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {rules.map((rule, ruleIndex) => (
                <div key={`rule-${rule.userAgent}-${ruleIndex}`} className="bg-white rounded-md border border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-black">User-agent: {rule.userAgent}</h3>
                      {rule.crawlDelay !== undefined && <p className="text-sm text-black opacity-60">Crawl-delay: {rule.crawlDelay}s</p>}
                    </div>
                    <button type="button" onClick={() => handleDeleteRule(ruleIndex)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center mb-2"><Eye className="w-4 h-4 text-green-500 mr-2" /><span className="font-medium text-gray-700">Allowed Paths</span></div>
                      <div className="space-y-2">
                        {rule.allow.map((path) => (
                          <div key={`allow-${path}`} className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                            <code className="text-sm text-green-800">{path}</code>
                            <button type="button" onClick={() => handleRemovePath(ruleIndex, path, 'allow')} className="p-1 text-green-600 hover:bg-green-100 rounded"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        ))}
                        <select onChange={(e) => { if (e.target.value) { handleAddPath(ruleIndex, e.target.value, 'allow'); e.target.value = ''; } }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                          <option value="">+ Add allowed path...</option>
                          {commonPaths.filter((p) => p.type === 'allow' && !rule.allow.includes(p.value)).map((path) => (
                            <option key={path.value} value={path.value}>{path.label} ({path.value})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-2"><EyeOff className="w-4 h-4 text-red-500 mr-2" /><span className="font-medium text-gray-700">Disallowed Paths</span></div>
                      <div className="space-y-2">
                        {rule.disallow.map((path) => (
                          <div key={`disallow-${path}`} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                            <code className="text-sm text-red-800">{path}</code>
                            <button type="button" onClick={() => handleRemovePath(ruleIndex, path, 'disallow')} className="p-1 text-red-600 hover:bg-red-100 rounded"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        ))}
                        <select onChange={(e) => { if (e.target.value) { handleAddPath(ruleIndex, e.target.value, 'disallow'); e.target.value = ''; } }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                          <option value="">+ Add disallowed path...</option>
                          {commonPaths.filter((p) => p.type === 'disallow' && !rule.disallow.includes(p.value)).map((path) => (
                            <option key={path.value} value={path.value}>{path.label} ({path.value})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-md border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-black lastik">robots.txt Editor</h2>
              <div className="flex space-x-2">
                <button type="button" onClick={handleCopyToClipboard}
                  className="flex items-center px-3 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}Copy
                </button>
                <button type="button" onClick={handleSave} disabled={loading}
                  className="flex items-center px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium transition-all">
                  <Save className="w-4 h-4 mr-1" />{loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            <textarea value={robotsContent}
              onChange={(e) => { setRobotsContent(e.target.value); parseRobotsContent(e.target.value); }}
              className="w-full h-96 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black placeholder:text-black"
              spellCheck={false} placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/" />
          </div>
        )}

        <div className="bg-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20 p-4">
          <h2 className="text-lg font-bold text-black lastik mb-4">robots.txt Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black">
            <div>
              <h3 className="font-semibold mb-2">Important Rules:</h3>
              <ul className="list-disc list-inside space-y-1 opacity-75">
                <li><strong>User-agent:</strong> Specifies which bot the rule applies to</li>
                <li><strong>Allow:</strong> Explicitly allows crawling of a path</li>
                <li><strong>Disallow:</strong> Prevents crawling of a path</li>
                <li><strong>Sitemap:</strong> Tells search engines where your sitemap is</li>
                <li><strong>Crawl-delay:</strong> Limits how often bots can crawl (in seconds)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Common Mistakes to Avoid:</h3>
              <ul className="list-disc list-inside space-y-1 opacity-75">
                <li>Don&apos;t block CSS/JS files - bots need them to render pages</li>
                <li>Be careful with wildcards (* and $) - they can have unintended effects</li>
                <li>Private content should be password protected, not just robots.txt blocked</li>
                <li>Test your robots.txt with Google&apos;s Robots Testing Tool</li>
                <li>Remember: robots.txt is a suggestion, not a security measure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
