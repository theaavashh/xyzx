'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search, Tag, X } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  children?: Array<{ id: string; name: string; slug: string }>;
}

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  categories: CategoryItem[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
  showFilterPanel: boolean;
  onToggleFilterPanel: () => void;
  onCloseFilterPanel: () => void;
}

export default function ProductFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  itemsPerPage,
  onItemsPerPageChange,
  categories,
  hasActiveFilters,
  clearFilters,
  showFilterPanel,
  onToggleFilterPanel,
  onCloseFilterPanel,
}: ProductFiltersProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => { onItemsPerPageChange(Number(e.target.value)); }}
              className="rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-2.5 text-sm text-gray-900 appearance-none focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all min-w-[120px]"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            onClick={onToggleFilterPanel}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm4 6a1 1 0 011-1h8a1 1 0 010 2H8a1 1 0 01-1-1zm2 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
            </svg>
            Filters
            {(categoryFilter || statusFilter) && (
              <span className="w-2 h-2 rounded-full bg-gray-900" />
            )}
          </button>

          {(categoryFilter || statusFilter) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilterPanel && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseFilterPanel}
            />
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 outer-sans">Filters</h3>
                <button
                  onClick={onCloseFilterPanel}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 outer-sans">
                    <Tag className="w-4 h-4 text-gray-400" />
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => { onCategoryChange(e.target.value); }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 appearance-none focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 outer-sans">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => { onStatusChange(e.target.value); }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 appearance-none focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 outer-sans">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Items Per Page
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { onItemsPerPageChange(Number(e.target.value)); }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 appearance-none focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>

                <button
                  onClick={() => { clearFilters(); onCloseFilterPanel(); }}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
