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
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BannerFormData>({
    defaultValues: {
      title: '',
      isActive: true,
      endDate: '',
      buttonText: '',
      buttonUrl: '',
      backgroundColor: '',
      textColor: '',
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
      setValue('endDate', banner.endDate || '');
      setValue('buttonText', banner.buttonText || '');
      setValue('buttonUrl', banner.buttonUrl || '');
      setValue('backgroundColor', banner.backgroundColor || '');
      setValue('textColor', banner.textColor || '');
    } else {
      setValue('title', '');
      setValue('isActive', true);
      setValue('endDate', '');
      setValue('buttonText', '');
      setValue('buttonUrl', '');
      setValue('backgroundColor', '');
      setValue('textColor', '');
    }
  }, [banner, setValue]);

  const onFormSubmit = (data: BannerFormData) => {
    const payload: BannerFormData = {
      title: data.title,
      isActive: data.isActive,
      endDate: data.endDate || null,
      buttonText: data.buttonText || null,
      buttonUrl: data.buttonUrl || null,
      backgroundColor: data.backgroundColor || null,
      textColor: data.textColor || null,
    };
    onSubmit(payload);
  };

  useEffect(() => {
    (window as Window & { __bannerFormSubmit?: () => void }).__bannerFormSubmit = handleSubmit(onFormSubmit);
    return () => {
      delete (window as Window & { __bannerFormSubmit?: () => void }).__bannerFormSubmit;
    };
  }, [handleSubmit, onFormSubmit]);

  const isEditMode = !!banner;

  return (
    <div className="space-y-6" id="banner-form">
      <div>
        <label className="block text-md font-medium text-black mb-2">
          Banner Title & Content *
        </label>
        <RichTextEditor
          value={titleValue || ''}
          onChange={(value) => setValue('title', value, { shouldValidate: true })}
          placeholder="e.g., Free Delivery on orders over NPR.10000. Don't miss discount."
          className="border border-gray-300 rounded-md"
          height={250}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
        <p className="text-sm text-gray-700 mt-1">
          Use the rich text editor to format your banner content with custom styling
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-md font-medium text-black mb-2">
            End Date (for countdown)
          </label>
          <input
            type="datetime-local"
            min={(() => {
              const now = new Date();
              const pad = (n: number) => String(n).padStart(2, '0');
              return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
            })()}
            value={watch('endDate') ? (watch('endDate') as string).slice(0, 16) : ''}
            onChange={(e) => setValue('endDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
          <p className="text-sm text-gray-700 mt-1">
            Leave empty for no countdown timer
          </p>
        </div>

        <div>
          <label className="block text-md font-medium text-black mb-2">
            Status
          </label>
          <div className="flex items-center h-[42px]">
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-md font-medium text-black mb-2">
            Button Text
          </label>
          <input
            type="text"
            value={watch('buttonText') as string}
            onChange={(e) => setValue('buttonText', e.target.value)}
            placeholder="e.g., SHOP NOW"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-md font-medium text-black mb-2">
            Button URL
          </label>
          <input
            type="text"
            value={watch('buttonUrl') as string}
            onChange={(e) => setValue('buttonUrl', e.target.value)}
            placeholder="e.g., /sale"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-md font-medium text-black mb-2">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={watch('backgroundColor') || '#ffffff'}
              onChange={(e) => setValue('backgroundColor', e.target.value)}
              className="h-[42px] w-[42px] border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={watch('backgroundColor') as string}
              onChange={(e) => setValue('backgroundColor', e.target.value)}
              placeholder="#ffffff"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>

        <div>
          <label className="block text-md font-medium text-black mb-2">
            Text Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={watch('textColor') || '#000000'}
              onChange={(e) => setValue('textColor', e.target.value)}
              className="h-[42px] w-[42px] border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={watch('textColor') as string}
              onChange={(e) => setValue('textColor', e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">
          Preview
        </label>
        <div
          className="p-4 rounded-md border-2 border-dashed border-gray-200"
          style={{
            backgroundColor: watch('backgroundColor') || '#C6E2E7',
            color: watch('textColor') || '#1F2937',
          }}
        >
          <div className="text-center">
            <div
              className="text-md font-medium"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(titleValue || 'Banner content will appear here'),
              }}
            />
            {watch('buttonText') && (
              <span className="inline-block mt-2 text-xs font-bold uppercase underline underline-offset-4 opacity-80">
                {watch('buttonText')}
              </span>
            )}
          </div>
        </div>
      </div>

      {showActions && (
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
