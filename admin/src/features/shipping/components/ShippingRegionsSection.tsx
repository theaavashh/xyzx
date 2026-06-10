'use client';

import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Globe } from 'lucide-react';
import type { ShippingItem } from '../types';

interface Props {
  items: ShippingItem[];
  onCreate: () => void;
  onEdit: (item: ShippingItem) => void;
  onDelete: (item: ShippingItem) => void;
  onToggle: (item: ShippingItem) => void;
}

export function ShippingRegionsSection({ items, onCreate, onEdit, onDelete, onToggle }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">International Regions</h3>
        <button onClick={onCreate} className="flex items-center px-3 py-1.5 text-sm bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8962e] transition-colors">
          <Plus className="w-4 h-4 mr-1" /> Add Region
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">No regions yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 text-sm">{item.region}</p>
                  <p className="text-xs text-zinc-400">{item.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-zinc-900">{item.price}</span>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onToggle(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded">{item.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}</button>
                  <button onClick={() => onDelete(item)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
