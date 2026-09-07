'use client';

import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import type { FAQItem } from '../types';

interface FAQListProps {
  faqs: FAQItem[];
  onEdit: (faq: FAQItem) => void;
  onDelete: (faq: FAQItem) => void;
  onToggle: (faq: FAQItem) => void;
  isLoading: boolean;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
      <div className="flex-1 h-4 bg-gray-200 rounded" />
      <div className="w-20 h-4 bg-gray-200 rounded" />
      <div className="w-10 h-4 bg-gray-200 rounded" />
      <div className="w-14 h-5 bg-gray-200 rounded" />
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded" />
        <div className="w-8 h-8 bg-gray-200 rounded" />
        <div className="w-8 h-8 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function FAQList({ faqs, onEdit, onDelete, onToggle, isLoading }: FAQListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-400 text-lg">No FAQs yet.</p>
        <p className="text-gray-400 text-sm mt-1">Click "Add FAQ" to create one.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 font-medium">Question</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium w-16">Order</th>
            <th className="px-4 py-3 font-medium w-20">Status</th>
            <th className="px-4 py-3 font-medium w-28">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {faqs.map((faq) => (
            <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-900 max-w-xs truncate">
                {faq.question}
              </td>
              <td className="px-4 py-3 text-gray-600">{faq.category || '\u2014'}</td>
              <td className="px-4 py-3 text-gray-600 text-center">{faq.order}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                    faq.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {faq.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(faq)}
                    className="p-1.5 text-gray-400 hover:text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggle(faq)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    title={faq.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {faq.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(faq)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
