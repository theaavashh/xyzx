import { AnimatePresence, motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { CategoryFormData } from '@/schemas/categorySchema';

interface CategoryFormProps {
  form: UseFormReturn<CategoryFormData>;
  editingCategory: { id: string; name: string } | null;
  isSubmitting: boolean;
  isLoading: boolean;
  isUploadingImage: boolean;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getFullImageUrl: (path: string) => string;
}

export default function CategoryForm({
  form,
  editingCategory,
  isSubmitting,
  isLoading,
  isUploadingImage,
  onSubmit,
  onCancel,
  handleImageUpload,
  getFullImageUrl,
}: CategoryFormProps) {
  const { control, formState: { errors }, watch } = form;
  const categoryName = watch('name');
  const metaTitleValue = watch('metaTitle');
  const metaTitlePreview = metaTitleValue || categoryName || 'Category Name';
  const metaDescriptionValue = watch('metaDescription');
  const metaDescriptionPreview = metaDescriptionValue || 'Enter a meta description for this category...';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      >
        <motion.div
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-2xl font-semibold text-black">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Internal Link <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="internalLink"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  )}
                />
                {errors.internalLink && (
                  <p className="mt-1 text-xs text-red-500">{errors.internalLink.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category Image <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center transition hover:border-[#D4AF37] h-full flex flex-col items-center justify-center min-h-[140px]">
                      {field.value ? (
                        <div className="space-y-3">
                           <img
                             src={getFullImageUrl(field.value)}
                             alt="Preview"
                             className="mx-auto rounded-lg object-contain max-w-[160px] max-h-[120px]"
                           />
                          <button
                            type="button"
                            onClick={() => field.onChange('')}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-8 h-8 text-gray-300 mx-auto" />
                          <p className="text-sm text-gray-500">Click to upload an image</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={isUploadingImage}
                          />
                          <label
                            htmlFor="image-upload"
                            className={`inline-block rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer transition ${
                              isUploadingImage
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#D4AF37] hover:bg-[#B8960C]'
                            }`}
                          >
                            {isUploadingImage ? 'Uploading...' : 'Choose Image'}
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.image && (
                  <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-sm font-semibold text-black mb-3">SEO Settings</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
                  <Controller
                    name="metaTitle"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        maxLength={60}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    )}
                  />
                  <div className="mt-1.5 flex items-center justify-between">
                    <p className="text-xs text-gray-500">{metaTitleValue?.length || 0}/60</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Meta Description
                  </label>
                  <Controller
                    name="metaDescription"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        maxLength={160}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] resize-none"
                      />
                    )}
                  />
                  <p className="mt-1 text-xs text-gray-500">{metaDescriptionValue?.length || 0}/160</p>
                </div>
              </div>

              <div className="rounded-md bg-gray-50 p-3 mb-4">
                <p className="text-xs text-[#1a0dab] truncate">{metaTitlePreview}</p>
                <p className="text-xs text-[#006621] mt-0.5 truncate">
                  example.com/categories/{(categoryName || 'new-category').toLowerCase().replace(/\s+/g, '-')}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{metaDescriptionPreview}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Keywords</label>
                <Controller
                  name="keywords"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  )}
                />
                <p className="mt-1 text-xs text-gray-500">Separate keywords with commas</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-semibold"
              >
                {isSubmitting || isLoading
                  ? 'Saving...'
                  : editingCategory
                    ? 'Update Category'
                    : 'Add Category'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
