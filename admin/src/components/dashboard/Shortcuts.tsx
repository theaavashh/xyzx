'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface Shortcut {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: 'all-products', label: 'Products', path: '/dashboard/products', icon: 'Package' },
  { id: 'all-orders', label: 'Orders', path: '/dashboard/orders', icon: 'ShoppingCart' },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { id: 'manage-categories', label: 'Categories', path: '/dashboard/category', icon: 'FolderOpen' },
  { id: 'discounts', label: 'Discounts', path: '/dashboard/discounts', icon: 'Tag' },
  { id: 'all-staff', label: 'Staff', path: '/dashboard/user-management/all-staff', icon: 'Users' },
];

const STORAGE_KEY = 'dashboard-shortcuts';

function loadShortcuts(): Shortcut[] {
  if (typeof window === 'undefined') return DEFAULT_SHORTCUTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_SHORTCUTS;
}

function ShortcutIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    Package: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="M7.5 4.27 9 5"/></svg>,
    ShoppingCart: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    BarChart3: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 16v-3"/><path d="M12 16v-7"/><path d="M17 16v-4"/></svg>,
    FolderOpen: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    Tag: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>,
    Users: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    ExternalLink: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  };
  return <span className="text-[#D4AF37]">{icons[icon] || icons.ExternalLink}</span>;
}

export function Shortcuts() {
  const router = useRouter();
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newPath, setNewPath] = useState('');

  useEffect(() => {
    setShortcuts(loadShortcuts());
  }, []);

  const saveShortcuts = (updated: Shortcut[]) => {
    setShortcuts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeShortcut = (id: string) => {
    saveShortcuts(shortcuts.filter((s) => s.id !== id));
  };

  const addShortcut = () => {
    const label = newLabel.trim();
    const path = newPath.trim();
    if (!label || !path) return;
    const id = `custom-${Date.now()}`;
    saveShortcuts([...shortcuts, { id, label, path, icon: 'ExternalLink' }]);
    setNewLabel('');
    setNewPath('');
    setShowModal(false);
  };

  const resetDefaults = () => {
    saveShortcuts(DEFAULT_SHORTCUTS);
  };

  return (
    <>
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-black outer-sans uppercase tracking-wide">Quick Shortcuts</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetDefaults}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:text-[#c9a32e] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Shortcut
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.id}
                className="group relative flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg cursor-pointer transition-all hover:border-[#D4AF37]/40"
                onClick={() => router.push(shortcut.path)}
              >
                <ShortcutIcon icon={shortcut.icon} />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{shortcut.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeShortcut(shortcut.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-black outer-sans mb-4">Add Shortcut</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Create Coupon"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none focus:border-[#D4AF37] text-sm text-black"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
                <input
                  type="text"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  placeholder="e.g. /dashboard/discounts"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:outline-none focus:border-[#D4AF37] text-sm text-black"
                />
                <p className="text-xs text-gray-400 mt-1">Enter a relative path like <code className="bg-gray-100 px-1 rounded">/dashboard/...</code></p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addShortcut}
                  disabled={!newLabel.trim() || !newPath.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#D4AF37] rounded-md hover:bg-[#c9a32e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
