'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/apiClient';
import toast from 'react-hot-toast';

interface AttributeOption {
  id: string;
  type: string;
  value: string;
  label: string | null;
  sortOrder: number;
  isActive: boolean;
}

const ATTRIBUTE_TYPES = [
  { key: 'gender', label: 'Gender' },
  { key: 'season', label: 'Season' },
  { key: 'occasion', label: 'Occasion' },
  { key: 'fitType', label: 'Fit Type' },
  { key: 'pattern', label: 'Pattern' },
  { key: 'sleeveStyle', label: 'Sleeve Style' },
  { key: 'neckStyle', label: 'Neck Style' },
];

export default function ProductAttributesPage() {
  const [options, setOptions] = useState<AttributeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [newValues, setNewValues] = useState<Record<string, string>>({});

  const fetchOptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/attribute-options');
      setOptions(res.data?.data ?? res.data ?? []);
    } catch {
      toast.error('Failed to load attribute options');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const grouped = ATTRIBUTE_TYPES.map((t) => ({
    ...t,
    items: options.filter((o) => o.type === t.key),
  }));

  const handleAdd = async (type: string) => {
    const value = newValues[type]?.trim();
    if (!value) return;

    try {
      const res = await api.post('/api/v1/attribute-options', {
        type,
        value,
        label: value,
        sortOrder: 0,
      });
      const created = res.data?.data ?? res.data;
      setOptions((prev) => [...prev, created]);
      setNewValues((prev) => ({ ...prev, [type]: '' }));
      toast.success(`"${value}" added to ${type}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add option');
    }
  };

  const handleDelete = async (option: AttributeOption) => {
    const confirmed = window.confirm(`Delete "${option.value}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await api.delete(`/api/v1/attribute-options/${option.id}`);
      setOptions((prev) => prev.filter((o) => o.id !== option.id));
      toast.success(`"${option.value}" deleted`);
    } catch {
      toast.error('Failed to delete option');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Attributes</h1>
            <p className="text-sm text-gray-500 mt-1">Manage dropdown options for product attributes</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(({ key, label, items }) => (
              <div key={key} className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{label}</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  {items.length === 0 && (
                    <span className="text-sm text-gray-400 italic">No options yet</span>
                  )}
                  {items.map((opt) => (
                    <span
                      key={opt.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700"
                    >
                      {opt.label || opt.value}
                      <button
                        type="button"
                        onClick={() => handleDelete(opt)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newValues[key] ?? ''}
                    onChange={(e) =>
                      setNewValues((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAdd(key);
                      }
                    }}
                    placeholder={`Add new ${label.toLowerCase()} option...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 text-black"
                  />
                  <button
                    type="button"
                    onClick={() => handleAdd(key)}
                    disabled={!newValues[key]?.trim()}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
