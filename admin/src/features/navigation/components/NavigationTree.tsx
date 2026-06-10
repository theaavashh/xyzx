'use client';

import { motion } from 'framer-motion';
import {
  ChevronDown,
  Code2,
  FolderTree,
  Link as LinkIcon,
  Menu,
  Plus,
} from 'lucide-react';
import type { NavItem } from '../types';

interface NavigationTreeProps {
  items: NavItem[];
  isLoading: boolean;
  onEdit: (item: NavItem) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onViewJson: (item: NavItem) => void;
  onCreateNew: () => void;
}

export function NavigationTree({
  items,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
  onReorder,
  onViewJson,
  onCreateNew,
}: NavigationTreeProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 mb-4" />
          <p className="text-sm text-gray-500">Loading navigation...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No navigation items</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Create your first navigation item to start building your storefront menu.
          </p>
          <button
            type="button"
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2.5 lastik text-lg rounded-md hover:bg-[#b8962e] transition-colors font-semibold"
          >
            <Plus className="w-4 h-4" />
            Create Navigation Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {items.map((item, index) => (
        <NavItemCard
          key={item.id}
          item={item}
          index={index}
          total={items.length}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onReorder={onReorder}
          onViewJson={onViewJson}
        />
      ))}
    </div>
  );
}

function NavItemCard({
  item,
  index,
  total,
  onEdit,
  onDelete,
  onToggleStatus,
  onReorder,
  onViewJson,
}: {
  item: NavItem;
  index: number;
  total: number;
  onEdit: (item: NavItem) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onViewJson: (item: NavItem) => void;
}) {
  const totalLinks = item.columns.reduce((sum, col) => sum + col.links.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-md border border-gray-200 overflow-hidden min-h-[200px] flex flex-col"
    >
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => onReorder(item.id, 'up')}
              disabled={index === 0}
              className="p-0.5 text-gray-300 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="w-3 h-3 -rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => onReorder(item.id, 'down')}
              disabled={index === total - 1}
              className="p-0.5 text-gray-300 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="w-3 h-3 rotate-90" />
            </button>
          </div>
          
          <div className="flex-1 min-w-0">
            <span className="font-medium text-gray-900">{item.name}</span>
            <p className="text-xs text-gray-500 truncate">{item.href}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {item.columns.map((column, colIndex) => (
            <div key={colIndex} className="bg-gray-50 rounded-lg border border-gray-100 p-3">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-gray-200">
                <FolderTree className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-sm font-medium text-gray-900 truncate">{column.title}</span>
                <span className="ml-auto text-xs text-gray-400">{column.links.length}</span>
              </div>
              <ul className="space-y-1.5">
                {column.links.length === 0 && (
                  <li className="text-xs text-gray-400 italic">No links</li>
                )}
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="flex items-center gap-2 text-xs text-gray-600">
                    <LinkIcon className="w-3 h-3 text-gray-300 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.isActive
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {item.isActive ? 'Active' : 'Hidden'}
          </span>
          <span className="text-xs text-gray-400">
            {item.columns.length} col{item.columns.length !== 1 ? 's' : ''} · {totalLinks} link{totalLinks !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewJson(item)}
            className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
            title="View JSON"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(item.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              item.isActive
                ? 'text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20'
                : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            {item.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="px-3 py-1.5 text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-md hover:bg-[#D4AF37]/20 transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
