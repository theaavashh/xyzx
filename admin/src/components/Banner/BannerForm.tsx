import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Package } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import type { Banner, BannerFormData } from '@/types/banner.types';
import { sanitizeHtml } from '@/utils/sanitize';

interface BannerFormProps {
  banner?: Banner | null;
  onSubmit: (data: BannerFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  showActions?: boolean;
}

export default function BannerForm({
  banner,
  onSubmit,
  onCancel,
  isSubmitting = false,
  showActions = true,
}: BannerFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BannerFormData>({
    defaultValues: {
      title: '',
      isActive: true,
    },
    resolver: (values) => {
      const plainText = values.title.replace(/<[^>]*>/g, '').trim();
      return {
        values: plainText ? values : {},
        errors: plainText
          ? {}
          : {
              title: {
                type: 'required',
                message: 'Banner content is required',
              },
            },
      };
    },
  });

  const titleValue = watch('title');

  useEffect(() => {
    if (banner) {
      setValue('title', banner.title);
      setValue('isActive', banner.isActive);
    } else {
      setValue('title', '');
      setValue('isActive', true);
    }
  }, [banner, setValue]);

  const onFormSubmit = (data: BannerFormData) => {
    onSubmit(data);
  };

  // Expose handleSubmit to window for modal footer submission
  useEffect(() => {
    (window as Window & { __bannerFormSubmit?: () => void }).__bannerFormSubmit = handleSubmit(onFormSubmit);
    return () => {
      delete (window as Window & { __bannerFormSubmit?: () => void }).__bannerFormSubmit;
    };
  }, [handleSubmit, onFormSubmit]);

  const isEditMode = !!banner;

  return (
    <div className="space-y-6" id="banner-form">
      {/* Basic Information */}
      <div>
        <label className="block text-md font-medium text-black mb-2">
          Banner Title & Content *
        </label>
        <RichTextEditor
          value={titleValue || ''}
          onChange={(value) => setValue('title', value, { shouldValidate: true })}
          placeholder="e.g., Free Delivery on orders over NPR.10000. Don't miss discount."
          className="border border-gray-300 rounded-md lastik"
          height={250}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
        <p className="text-sm text-gray-700 mt-1">
          Use the rich text editor to format your banner content with custom
          styling
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={watch('isActive') || false}
          onChange={(e) => setValue('isActive', e.target.checked)}
          className="h-4 w-4 accent-[#D4AF37] checked:bg-[#D4AF37] checked:border-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-md text-black">
          Active (visible on website)
        </label>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Preview
        </label>
        <div className="p-4 rounded-md border-2 border-dashed border-gray-200 bg-[#D4AF37]/5">
          <div className="text-center">
            <div
              className="text-md font-medium text-black"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(titleValue || 'Banner content will appear here'),
              }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-700 mt-2">
          Banner colors will use the global theme settings configured in Settings
        </p>
      </div>

      {/* Form Actions - Only shown when showActions is true (for standalone usage) */}
      {showActions && (
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] lastik"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2.5 bg-[#D4AF37] lastik text-white rounded-md hover:bg-[#b8962e] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Package className="w-4 h-4" />
                {isEditMode ? 'Update Banner' : 'Create Banner'}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
