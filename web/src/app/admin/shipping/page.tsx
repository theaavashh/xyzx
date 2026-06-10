'use client';

import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';
import type { ShippingContent, ShippingMethod, ShippingInfo, InternationalRegion } from '@/components/Shipping/types';

const API_BASE = '/api/v1/admin/shipping';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

function Field({ label, value, onChange, placeholder, multiline }: FieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  const cls = "w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300 transition-all bg-white";
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">{label}</label>
      {multiline ? (
        <textarea id={id} className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={2} />
      ) : (
        <input id={id} type="text" className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-zinc-900' : 'bg-zinc-200'}`}
    >
      <span className={`block w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200 absolute top-0.5 ${checked ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
    </button>
  );
}

function SectionCard({ title, children, onAdd, addLabel }: { title: string; children: React.ReactNode; onAdd: () => void; addLabel: string }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        <button onClick={onAdd} className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors">
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg">
      <GripVertical className="w-3.5 h-3.5 text-zinc-300 mt-1.5 shrink-0" />
      {children}
    </div>
  );
}

export default function AdminShippingPage() {
  const [content, setContent] = useState<ShippingContent>({
    heroTitle: '', heroSubtitle: '', methods: [], info: [], regions: [],
    freeShippingThreshold: '', freeInternationalThreshold: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(API_BASE)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) setContent(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(API_BASE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    if (res.ok) setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  function addMethod() {
    setContent({
      ...content,
      methods: [...content.methods, { id: String(Date.now()), name: '', price: '', time: '', description: '', isActive: true, order: content.methods.length + 1 }],
    });
  }

  function addInfo() {
    setContent({
      ...content,
      info: [...content.info, { id: String(Date.now()), title: '', description: '', order: content.info.length + 1, isActive: true }],
    });
  }

  function addRegion() {
    setContent({
      ...content,
      regions: [...content.regions, { id: String(Date.now()), region: '', time: '', price: '', isActive: true, order: content.regions.length + 1 }],
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-4 h-4 border border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Admin</p>
            <h1 className="text-xl font-semibold text-zinc-900">Shipping Information</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Field label="Hero Title" value={content.heroTitle} onChange={(v) => setContent({ ...content, heroTitle: v })} placeholder="Shipping Information" />
          <Field label="Hero Subtitle" value={content.heroSubtitle} onChange={(v) => setContent({ ...content, heroSubtitle: v })} placeholder="Everything you need to know..." />
        </div>

        <div className="space-y-4 mb-6">
          <SectionCard title="Shipping Methods" addLabel="Add Method" onAdd={addMethod}>
            <div className="space-y-3">
              {content.methods.map((method, i) => {
                const badges = [
                  { label: 'Standard', color: 'bg-zinc-100 text-zinc-600' },
                  { label: 'Popular', color: 'bg-emerald-100 text-emerald-700' },
                  { label: 'Express', color: 'bg-blue-100 text-blue-700' },
                  { label: 'Fastest', color: 'bg-amber-100 text-amber-700' },
                  { label: 'Premium', color: 'bg-purple-100 text-purple-700' },
                  { label: 'Economy', color: 'bg-cyan-100 text-cyan-700' },
                ];
                return (
                  <div key={method.id} className="border border-zinc-200 rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-50">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                        <span className="text-sm font-medium text-zinc-900">{method.name || 'Untitled Method'}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${method.isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                          {method.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Toggle
                          checked={method.isActive}
                          onChange={(v) => {
                            const m = [...content.methods];
                            m[i] = { ...m[i], isActive: v };
                            setContent({ ...content, methods: m });
                          }}
                        />
                        <button
                          onClick={() => setContent({ ...content, methods: content.methods.filter((_, idx) => idx !== i) })}
                          className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="sm:col-span-2 lg:col-span-1">
                          <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Name</label>
                          <input
                            type="text"
                            value={method.name}
                            onChange={(e) => { const m = [...content.methods]; m[i] = { ...m[i], name: e.target.value }; setContent({ ...content, methods: m }); }}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
                            placeholder="Standard Shipping"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Price</label>
                          <input
                            type="text"
                            value={method.price}
                            onChange={(e) => { const m = [...content.methods]; m[i] = { ...m[i], price: e.target.value }; setContent({ ...content, methods: m }); }}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
                            placeholder="$5.99"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Delivery Time</label>
                          <input
                            type="text"
                            value={method.time}
                            onChange={(e) => { const m = [...content.methods]; m[i] = { ...m[i], time: e.target.value }; setContent({ ...content, methods: m }); }}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
                            placeholder="5-7 business days"
                          />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Badge</label>
                          <div className="flex flex-wrap gap-1.5">
                            {badges.map((badge) => (
                              <button
                                key={badge.label}
                                type="button"
                                onClick={() => { const m = [...content.methods]; m[i] = { ...m[i], description: badge.label }; setContent({ ...content, methods: m }); }}
                                className={`text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${method.description === badge.label ? badge.color + ' ring-1 ring-zinc-300' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                              >
                                {badge.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Description</label>
                        <textarea
                          value={!badges.some(b => b.label === method.description) ? method.description : ''}
                          onChange={(e) => { const m = [...content.methods]; m[i] = { ...m[i], description: e.target.value }; setContent({ ...content, methods: m }); }}
                          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
                          placeholder="Free on orders over $100"
                          rows={1}
                        />
                      </div>
                    </div>
                    <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100">
                      <p className="text-[10px] text-zinc-400">
                        Preview: <span className="text-zinc-600">{method.name || 'Method'} — {method.price || '$0'} ({method.time || 'delivery time'})</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Delivery Info" addLabel="Add Info" onAdd={addInfo}>
            <div className="space-y-2">
              {content.info.map((item, i) => (
                <ListItem key={item.id}>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Field label="Title" value={item.title} onChange={(v) => { const m = [...content.info]; m[i] = { ...m[i], title: v }; setContent({ ...content, info: m }); }} placeholder="Order Processing" />
                    <Field label="Description" value={item.description} onChange={(v) => { const m = [...content.info]; m[i] = { ...m[i], description: v }; setContent({ ...content, info: m }); }} placeholder="Orders are processed within 1-2 business days." multiline />
                  </div>
                  <div className="flex items-center gap-3 pt-5 shrink-0">
                    <Toggle checked={item.isActive} onChange={(v) => { const m = [...content.info]; m[i] = { ...m[i], isActive: v }; setContent({ ...content, info: m }); }} />
                    <button onClick={() => setContent({ ...content, info: content.info.filter((_, idx) => idx !== i) })} className="text-zinc-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </ListItem>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-5">
            <Field label="Free Shipping Threshold" value={content.freeShippingThreshold} onChange={(v) => setContent({ ...content, freeShippingThreshold: v })} placeholder="$100" />
          </div>
          <div className="bg-white rounded-xl border border-zinc-200 p-5">
            <Field label="Free International Threshold" value={content.freeInternationalThreshold} onChange={(v) => setContent({ ...content, freeInternationalThreshold: v })} placeholder="$200" />
          </div>
        </div>

        <SectionCard title="International Regions" addLabel="Add Region" onAdd={addRegion}>
          <div className="space-y-2">
            {content.regions.map((region, i) => (
              <ListItem key={region.id}>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Field label="Region" value={region.region} onChange={(v) => { const m = [...content.regions]; m[i] = { ...m[i], region: v }; setContent({ ...content, regions: m }); }} placeholder="Europe" />
                  <Field label="Delivery Time" value={region.time} onChange={(v) => { const m = [...content.regions]; m[i] = { ...m[i], time: v }; setContent({ ...content, regions: m }); }} placeholder="7-10 business days" />
                  <Field label="Price" value={region.price} onChange={(v) => { const m = [...content.regions]; m[i] = { ...m[i], price: v }; setContent({ ...content, regions: m }); }} placeholder="$15.99" />
                </div>
                <div className="flex items-center gap-3 pt-5 shrink-0">
                  <Toggle checked={region.isActive} onChange={(v) => { const m = [...content.regions]; m[i] = { ...m[i], isActive: v }; setContent({ ...content, regions: m }); }} />
                  <button onClick={() => setContent({ ...content, regions: content.regions.filter((_, idx) => idx !== i) })} className="text-zinc-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </ListItem>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
