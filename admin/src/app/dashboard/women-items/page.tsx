'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import PageTemplate from '@/components/PageTemplate';
import { useWomenItemsQueries, type CategoryOption } from '@/features/women-items';

const GENDER_OPTIONS = ['Women', 'Men', 'Unisex', 'Kids'];

const schema = z.object({
  image: z.string().min(1, 'Image is required'),
  description: z.string().min(1, 'Description is required'),
  buttonTitle: z.string().min(1, 'Button title is required'),
  buttonCta: z.string().min(1, 'Button CTA is required'),
  filterType: z.enum(['gender', 'category']),
  filterValue: z.string().min(1, 'Please make a selection'),
});

type FormValues = z.infer<typeof schema>;

export default function WomenItemsPage() {
  const { fetchConfig, fetchCategories, saveConfig, uploadImage, isSaving } =
    useWomenItemsQueries();
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: '',
      description: '',
      buttonTitle: 'View all',
      buttonCta: '/products',
      filterType: 'gender',
      filterValue: 'Women',
    },
  });

  const image = watch('image');
  const filterType = watch('filterType');

  useEffect(() => {
    (async () => {
      const data = await fetchConfig();
      if (data) {
        reset({
          image: data.image ?? '',
          description: data.description ?? '',
          buttonTitle: data.buttonTitle ?? 'View all',
          buttonCta: data.buttonCta ?? '/products',
          filterType: (data.filterType as FormValues['filterType']) ?? 'gender',
          filterValue: data.filterValue ?? 'Women',
        });
        setPreviewLoaded(true);
      }
    })();
    fetchCategories().then(setCategories);
  }, [fetchConfig, fetchCategories, reset]);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        setValue('image', url, { shouldValidate: true });
        setPreviewLoaded(false);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    await saveConfig(values as unknown as Record<string, string>);
  };

  return (
    <PageTemplate title="Women Items">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
        noValidate
      >
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-black">Women Items</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure the women&apos;s section shown on the storefront
            </p>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8960C] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
          {isUploading ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-600 mt-2">Uploading...</p>
            </div>
          ) : image ? (
            <div className="relative w-full max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Women section preview"
                className="w-full h-56 object-cover rounded-lg border border-gray-200"
                onLoad={() => setPreviewLoaded(true)}
              />
              {previewLoaded && (
                <button
                  type="button"
                  onClick={() => setValue('image', '', { shouldValidate: true })}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-[#D4AF37] transition-colors">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-600 mt-2">
                <span className="font-medium text-[#D4AF37]">Click to upload</span> image
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          )}
          {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            placeholder="Enter the section description"
            className={`w-full px-3 py-2 border rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none resize-y placeholder:text-gray-400 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Button title + CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="buttonTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Button Title *
            </label>
            <input
              id="buttonTitle"
              type="text"
              {...register('buttonTitle')}
              placeholder="e.g. View all"
              className={`w-full px-3 py-2 border rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none placeholder:text-gray-400 ${
                errors.buttonTitle ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.buttonTitle && (
              <p className="mt-1 text-xs text-red-500">{errors.buttonTitle.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="buttonCta" className="block text-sm font-medium text-gray-700 mb-1">
              Button CTA (Link) *
            </label>
            <input
              id="buttonCta"
              type="text"
              {...register('buttonCta')}
              placeholder="e.g. /products"
              className={`w-full px-3 py-2 border rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none placeholder:text-gray-400 ${
                errors.buttonCta ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.buttonCta && (
              <p className="mt-1 text-xs text-red-500">{errors.buttonCta.message}</p>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
              Show Products By *
            </label>
            <select
              id="filterType"
              {...register('filterType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none bg-white"
            >
              <option value="gender">Gender</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterValue" className="block text-sm font-medium text-gray-700 mb-1">
              {filterType === 'category' ? 'Category *' : 'Gender *'}
            </label>
            {filterType === 'category' ? (
              <select
                id="filterValue"
                {...register('filterValue')}
                className={`w-full px-3 py-2 border rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none bg-white ${
                  errors.filterValue ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <select
                id="filterValue"
                {...register('filterValue')}
                className={`w-full px-3 py-2 border rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none bg-white ${
                  errors.filterValue ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            )}
            {errors.filterValue && (
              <p className="mt-1 text-xs text-red-500">{errors.filterValue.message}</p>
            )}
          </div>
        </div>
      </form>
    </PageTemplate>
  );
}
