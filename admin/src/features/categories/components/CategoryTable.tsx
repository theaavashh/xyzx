import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Edit,
  Eye,
  ImageIcon,
  LayoutGrid,
  List,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Category } from '../types';


type ViewMode = 'list' | 'grid';
type SortField = 'name' | 'status' | 'createdAt';

interface CategoryTableProps {
  categories: Category[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  getFullImageUrl: (imagePath: string) => string;
  handleImagePreview: (imageUrl: string) => void;
  handleEditClick: (category: Category) => void;
  handleDeleteClick: (id: string, name: string, type: 'category' | 'subcategory') => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  sortField: SortField | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  onBulkDelete: () => void;
  onBulkStatusToggle: () => void;
}

function ImageSkeleton({ noImage }: { noImage?: boolean }) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${noImage ? 'bg-gray-50' : 'bg-gray-100 animate-pulse'}`}>
      <ImageIcon className={`${noImage ? 'w-6 h-6 text-gray-300' : 'w-5 h-5 text-gray-300'}`} />
      {noImage && <span className="sr-only">No image</span>}
    </div>
  );
}

function CategoryImage({
  src,
  alt,
  className,
  getFullImageUrl,
  onPreview,
}: {
  src: string;
  alt: string;
  className: string;
  getFullImageUrl: (path: string) => string;
  onPreview?: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src) {
    return <ImageSkeleton noImage />;
  }

  if (hasError) {
    return <ImageSkeleton />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getFullImageUrl(src)}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      onClick={onPreview}
    />
  );
}

const statusStyles = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-red-100 text-red-700',
};

function SortHeader({
  field,
  currentField,
  direction,
  onSort,
  children,
}: {
  field: SortField;
  currentField: SortField | null;
  direction: 'asc' | 'desc';
  onSort: (f: SortField) => void;
  children: React.ReactNode;
}) {
  const isActive = currentField === field;
  return (
    <th
      className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-800 transition-colors outer-sans"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1.5">
        {children}
        <span
          className={`inline-flex transition-opacity ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {isActive && direction === 'asc' ? (
            <ArrowUp className="w-3 h-3 text-[#D4AF37]" />
          ) : isActive && direction === 'desc' ? (
            <ArrowDown className="w-3 h-3 text-[#D4AF37]" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-300" />
          )}
        </span>
      </div>
    </th>
  );
}

function BulkActionsBar({
  count,
  onDelete,
  onStatusToggle,
  onClear,
}: {
  count: number;
  onDelete: () => void;
  onStatusToggle: () => void;
  onClear: () => void;
}) {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-2.5"
    >
      <span className="text-sm font-medium text-gray-700">
        <span className="text-[#D4AF37] font-semibold">{count}</span> selected
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onStatusToggle}
          className="inline-flex items-center gap-1.5 rounded-md bg-white border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Toggle Status
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
        <button
          onClick={onClear}
          className="rounded-md px-2 py-1.5 text-xs font-medium text-gray-400 transition hover:text-gray-600"
        >
          Clear
        </button>
      </div>
    </motion.div>
  );
}

export default function CategoryTable({
  categories,
  viewMode,
  onViewModeChange,
  getFullImageUrl,
  handleImagePreview,
  handleEditClick,
  handleDeleteClick,
  selectedIds,
  onSelectionChange,
  sortField,
  sortDirection,
  onSort,
  onBulkDelete,
  onBulkStatusToggle,
}: CategoryTableProps) {
  const allSelected = categories.length > 0 && categories.every((c) => selectedIds.includes(c.id));
  const someSelected = categories.some((c) => selectedIds.includes(c.id));

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange(selectedIds.filter((id) => !categories.some((c) => c.id === id)));
    } else {
      const newIds = [...selectedIds];
      for (const c of categories) {
        if (!newIds.includes(c.id)) newIds.push(c.id);
      }
      onSelectionChange(newIds);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      <BulkActionsBar
        count={selectedIds.length}
        onDelete={onBulkDelete}
        onStatusToggle={onBulkStatusToggle}
        onClear={() => onSelectionChange([])}
      />

      {viewMode === 'list' ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="w-12 px-3 py-4">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                  />
                </th>
                <th className="w-10 px-2 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">
                  #
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">
                  Image
                </th>
                <SortHeader field="name" currentField={sortField} direction={sortDirection} onSort={onSort}>
                  Name
                </SortHeader>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">
                  Internal Link
                </th>
                <SortHeader field="status" currentField={sortField} direction={sortDirection} onSort={onSort}>
                  Status
                </SortHeader>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider outer-sans">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((category, index) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`transition-colors ${
                    selectedIds.includes(category.id)
                      ? 'bg-amber-50/60'
                      : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50/30'
                  } hover:bg-amber-50/30`}
                >
                  <td className="w-12 px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(category.id)}
                      onChange={() => handleSelectOne(category.id)}
                      className="h-4 w-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                    />
                  </td>
                  <td className="w-10 px-2 py-4 text-center text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 ring-1 ring-gray-200 shadow-sm">
                      <CategoryImage
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover cursor-pointer"
                        getFullImageUrl={getFullImageUrl}
                        onPreview={() => handleImagePreview(category.image)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-gray-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-500 truncate max-w-[200px] block">
                      {category.internalLink || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold ${statusStyles[category.status]}`}
                    >
                      {category.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleImagePreview(category.image)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                      <button
                        onClick={() => handleEditClick(category)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category.id, category.name, 'category')}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold ${statusStyles[category.status]}`}
                  >
                    {category.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                  <CategoryImage
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    getFullImageUrl={getFullImageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{category.name}</h3>

                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <button
                      onClick={() => handleImagePreview(category.image)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
                      title="Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEditClick(category)}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category.id, category.name, 'category')}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 transition ml-auto"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
