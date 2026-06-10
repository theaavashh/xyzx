'use client';

import { Image as ImageIcon, Package, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { ServiceItem } from '../types';

interface FollowServiceListProps {
  items: ServiceItem[];
  isUploading: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: string | number | boolean) => void;
  onImageUpload: (index: number, file: File) => void;
}

export function FollowServiceList({
  items,
  isUploading,
  onAdd,
  onRemove,
  onUpdate,
  onImageUpload,
}: FollowServiceListProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <Package className="w-4 h-4" />
          Service Items
        </h3>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-sm text-[#A68520] hover:text-[#8B6914]"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => onUpdate(index, 'title', e.target.value)}
                  placeholder="Service Title (e.g., Fast Shipping)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => onUpdate(index, 'description', e.target.value)}
                  placeholder="Description (e.g., Free delivery on orders over $400)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
                />
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Service Icon
                  </label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith('image/')) {
                        onImageUpload(index, file);
                      }
                    }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: Event) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) onImageUpload(index, file);
                      };
                      input.click();
                    }}
                    className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      item.image
                        ? 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'
                    }`}
                  >
                    {item.image ? (
                      <div className="relative w-12 h-12">
                        <Image
                          src={item.image.startsWith('/uploads/') ? item.image : item.image}
                          alt={item.title || 'Service'}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500 mt-1">
                      {item.image ? 'Drop to replace' : 'Drop or click'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No service items added yet</p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-2 text-[#A68520] hover:text-[#8B6914] text-sm"
          >
            Add your first service
          </button>
        </div>
      )}
    </div>
  );
}
