'use client';

import React from 'react';
import { Package, Tag, FileText, AlertCircle, Info, X, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../RichTextEditor'), { ssr: false });

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  _count?: { products: number };
}

interface BasicInfoTabProps {
  formData: {
    name: string;
    productCode: string;
    categoryId: string;
    subCategoryId: string;
    tags: string[];
    isVariant: boolean;
    description: string;
    shortDescription: string;
    disclaimer: string;
    materialCare: string;
    gender: string;
    season: string;
    material: string;
    occasion: string;
    fitType: string;
    pattern: string;
    sleeveStyle: string;
    neckStyle: string;
    washCare: string;
  };
  categories: Category[];
  errors: Record<string, string>;
  onInputChange: (field: string, value: unknown) => void;
  onArrayChange: (field: string, value: string, action: 'add' | 'remove') => void;
  newTag: string;
  onNewTagChange: (value: string) => void;
  section?: 'identity' | 'details';
  attributeOptions?: Record<string, Array<{ value: string; label: string }>>;
}

const validateBasicInfo = (formData: BasicInfoTabProps['formData']): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!formData.name?.trim()) errors.name = 'Product name is required';
  if (!formData.productCode?.trim()) errors.productCode = 'Product code is required';
  if (!formData.categoryId) errors.categoryId = 'Please select a category';
  if (!formData.description?.trim()) errors.description = 'Product description is required';
  return errors;
};

const FALLBACK_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  gender: [
    { value: 'Men', label: 'Men' }, { value: 'Women', label: 'Women' },
    { value: 'Unisex', label: 'Unisex' }, { value: 'Kids', label: 'Kids' },
    { value: 'Boys', label: 'Boys' }, { value: 'Girls', label: 'Girls' },
  ],
  season: [
    { value: 'Spring', label: 'Spring' }, { value: 'Summer', label: 'Summer' },
    { value: 'Autumn', label: 'Autumn' }, { value: 'Winter', label: 'Winter' },
    { value: 'All Season', label: 'All Season' },
  ],
  occasion: [
    { value: 'Casual', label: 'Casual' }, { value: 'Formal', label: 'Formal' },
    { value: 'Party', label: 'Party' }, { value: 'Sports', label: 'Sports' },
    { value: 'Streetwear', label: 'Streetwear' }, { value: 'Work', label: 'Work' },
    { value: 'Wedding', label: 'Wedding' }, { value: 'Travel', label: 'Travel' },
  ],
  fitType: [
    { value: 'Slim', label: 'Slim' }, { value: 'Regular', label: 'Regular' },
    { value: 'Relaxed', label: 'Relaxed' }, { value: 'Oversized', label: 'Oversized' },
    { value: 'Skinny', label: 'Skinny' }, { value: 'Loose', label: 'Loose' },
  ],
  pattern: [
    { value: 'Solid', label: 'Solid' }, { value: 'Striped', label: 'Striped' },
    { value: 'Printed', label: 'Printed' }, { value: 'Checked', label: 'Checked' },
    { value: 'Floral', label: 'Floral' }, { value: 'Graphic', label: 'Graphic' },
    { value: 'Embroidered', label: 'Embroidered' }, { value: 'Tie Dye', label: 'Tie Dye' },
  ],
  sleeveStyle: [
    { value: 'Short Sleeve', label: 'Short Sleeve' }, { value: 'Full Sleeve', label: 'Full Sleeve' },
    { value: 'Sleeveless', label: 'Sleeveless' }, { value: 'Half Sleeve', label: 'Half Sleeve' },
    { value: '3/4 Sleeve', label: '3/4 Sleeve' }, { value: 'Raglan', label: 'Raglan' },
    { value: 'Puff Sleeve', label: 'Puff Sleeve' },
  ],
  neckStyle: [
    { value: 'Round Neck', label: 'Round Neck' }, { value: 'V-Neck', label: 'V-Neck' },
    { value: 'Collar', label: 'Collar' }, { value: 'Polo', label: 'Polo' },
    { value: 'Hooded', label: 'Hooded' }, { value: 'Turtle Neck', label: 'Turtle Neck' },
    { value: 'Crew Neck', label: 'Crew Neck' }, { value: 'Boat Neck', label: 'Boat Neck' },
    { value: 'Off Shoulder', label: 'Off Shoulder' },
  ],
};

const BasicInfoTab: React.FC<BasicInfoTabProps> = React.memo(({
  formData,
  categories,
  errors,
  onInputChange,
  onArrayChange,
  newTag,
  onNewTagChange,
  section,
  attributeOptions,
}) => {
  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newTag.trim()) {
        onArrayChange('tags', newTag.trim(), 'add');
        onNewTagChange('');
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      onArrayChange('tags', newTag.trim(), 'add');
      onNewTagChange('');
    }
  };

  return (
    <div className="space-y-6">
      {(!section || section === 'identity') && (
        <>
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    onInputChange('name', e.target.value);
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none text-black bg-gray-50 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Code *
                </label>
                <input
                  type="text"
                  value={formData.productCode}
                  onChange={(e) => onInputChange('productCode', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none text-black bg-gray-50 ${
                    errors.productCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product code"
                />
                {errors.productCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.productCode}</p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => {
                      onInputChange('categoryId', e.target.value);
                      onInputChange('subCategoryId', '');
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none text-black bg-gray-50 ${
                      errors.categoryId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}{' '}
                        {category._count && `(${category._count.products} products)`}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Category
                  </label>
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) => onInputChange('subCategoryId', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-black bg-gray-50"
                    disabled={!formData.categoryId}
                  >
                    <option value="">Select Sub Category</option>
                    {selectedCategory?.children?.map((subCategory) => (
                      <option key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-600" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-200 text-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => onArrayChange('tags', tag, 'remove')}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => onNewTagChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                placeholder="Enter tag"
                onKeyPress={handleTagKeyPress}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isVariant"
              checked={formData.isVariant}
              onChange={(e) => onInputChange('isVariant', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label htmlFor="isVariant" className="ml-2 block text-sm text-gray-900">
              This product has variants
            </label>
          </div>
        </>
      )}

      {(!section || section === 'details') && (
        <>
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Product Description *
            </h3>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => onInputChange('description', value)}
              placeholder="Enter detailed product description..."
              height={300}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-600" />
              Product Attributes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => onInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-black bg-gray-50"
                >
                  <option value="">Select Gender</option>
                  {(attributeOptions?.gender ?? FALLBACK_OPTIONS.gender).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                <select
                  value={formData.season}
                  onChange={(e) => onInputChange('season', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-black bg-gray-50"
                >
                  <option value="">Select Season</option>
                  {(attributeOptions?.season ?? FALLBACK_OPTIONS.season).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                <select
                  value={formData.occasion}
                  onChange={(e) => onInputChange('occasion', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-black bg-gray-50"
                >
                  <option value="">Select Occasion</option>
                  {(attributeOptions?.occasion ?? FALLBACK_OPTIONS.occasion).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fit Type</label>
                <select
                  value={formData.fitType}
                  onChange={(e) => onInputChange('fitType', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-black bg-gray-50"
                >
                  <option value="">Select Fit</option>
                  {(attributeOptions?.fitType ?? FALLBACK_OPTIONS.fitType).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                <select
                  value={formData.pattern}
                  onChange={(e) => onInputChange('pattern', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-black bg-gray-50"
                >
                  <option value="">Select Pattern</option>
                  {(attributeOptions?.pattern ?? FALLBACK_OPTIONS.pattern).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => onInputChange('material', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-black bg-gray-50"
                  placeholder="e.g. Cotton, Polyester"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sleeve Style</label>
                <select
                  value={formData.sleeveStyle}
                  onChange={(e) => onInputChange('sleeveStyle', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-black bg-gray-50"
                >
                  <option value="">Select Sleeve</option>
                  {(attributeOptions?.sleeveStyle ?? FALLBACK_OPTIONS.sleeveStyle).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Neck Style</label>
                <select
                  value={formData.neckStyle}
                  onChange={(e) => onInputChange('neckStyle', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-black bg-gray-50"
                >
                  <option value="">Select Neck</option>
                  {(attributeOptions?.neckStyle ?? FALLBACK_OPTIONS.neckStyle).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wash Care</label>
                <input
                  type="text"
                  value={formData.washCare}
                  onChange={(e) => onInputChange('washCare', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-black bg-gray-50"
                  placeholder="e.g. Machine wash cold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-gray-600" />
                Disclaimer
              </h3>
              <RichTextEditor
                value={formData.disclaimer}
                onChange={(value) => onInputChange('disclaimer', value)}
                placeholder="Enter disclaimer..."
                height={200}
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-600" />
                Material & Care
              </h3>
              <RichTextEditor
                value={formData.materialCare}
                onChange={(value) => onInputChange('materialCare', value)}
                placeholder="Enter material and care instructions..."
                height={200}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
});

BasicInfoTab.displayName = 'BasicInfoTab';

export { validateBasicInfo };
export default BasicInfoTab;
