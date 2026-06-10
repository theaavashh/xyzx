'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import type { FAQItem } from '@/components/FAQ/types';

const API_BASE = '/api/v1/admin/faqs';

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', category: '', order: 0, isActive: true });

  async function loadFAQs() {
    const res = await fetch(API_BASE);
    const json = await res.json();
    if (json.success) setFaqs(json.data);
    setLoading(false);
  }

  useEffect(() => { loadFAQs(); }, []);

  function resetForm() {
    setForm({ question: '', answer: '', category: '', order: 0, isActive: true });
    setEditing(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await fetch(`${API_BASE}/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    resetForm();
    loadFAQs();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    loadFAQs();
  }

  function startEdit(faq: FAQItem) {
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, order: faq.order, isActive: faq.isActive });
    setEditing(faq.id);
  }

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage FAQs</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{editing ? 'Edit FAQ' : 'Add New FAQ'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Question"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
            <input
              type="text"
              placeholder="Category (e.g. Orders, Shipping)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>
          <textarea
            placeholder="Answer"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
            rows={3}
            required
          />
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Active</span>
            </label>
            <input
              type="number"
              placeholder="Order"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="w-20 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-black font-semibold rounded-xl hover:bg-amber-300 transition-colors"
            >
              <Check className="w-4 h-4" />
              {editing ? 'Update' : 'Add'} FAQ
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : faqs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No FAQs yet. Add one above.</div>
        ) : (
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{cat}</h3>
                <div className="space-y-2">
                  {faqs.filter((f) => f.category === cat).map((faq) => (
                    <div key={faq.id} className="bg-white rounded-xl p-4 border border-gray-200 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{faq.question}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{faq.answer}</p>
                        <div className="flex gap-3 mt-2 text-xs text-gray-400">
                          <span>Order: {faq.order}</span>
                          <span className={faq.isActive ? 'text-green-600' : 'text-red-500'}>
                            {faq.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEdit(faq)}
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
