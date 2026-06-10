'use client';

import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import type { ShippingItem } from '../types';

interface Props {
  items: ShippingItem[];
  onCreate: () => void;
  onEdit: (item: ShippingItem) => void;
  onDelete: (item: ShippingItem) => void;
  onToggle: (item: ShippingItem) => void;
}

export function ShippingInfoSection({ items, onCreate, onEdit, onDelete, onToggle }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
        <button onClick={onCreate} className="flex items-center px-3 py-1.5 text-sm bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8962e] transition-colors">
          <Plus className="w-4 h-4 mr-1" /> Add Info
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">No info items yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <Info className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onToggle(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded">{item.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}</button>
                  <button onClick={() => onDelete(item)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <h4 className="font-semibold text-zinc-900 text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
