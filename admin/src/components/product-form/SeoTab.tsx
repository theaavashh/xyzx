'use client';

import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../RichTextEditor'), { ssr: false });

interface SeoTabProps {
  formData: {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    slug: string;
    canonicalUrl: string;
    robotsMeta: string;
    seoFriendlyImageFilename: string;
    imageAltText: string;
    productSchema: string;
    brandSchema: string;
    breadcrumbSchema: string;
    itemListSchema: string;
    faqSchema: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCardMeta: string;
    productDescription: string;
    faqs: string;
  };
  productName: string;
  errors: Record<string, string>;
  onInputChange: (field: string, value: unknown) => void;
  onArrayChange: (field: string, value: string, action: 'add' | 'remove') => void;
  onSlugManuallyEdited: () => void;
}

const validateSeo = (_formData: SeoTabProps['formData']): Record<string, string> => {
  return {};
};

const SeoTab: React.FC<SeoTabProps> = React.memo(({
  formData,
  productName,
  errors,
  onInputChange,
  onArrayChange,
  onSlugManuallyEdited,
}) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleSlugChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    onInputChange('slug', slug);
    onSlugManuallyEdited();
  };

  const handleSlugBlur = () => {
    if (!formData.slug) {
      const autoSlug = productName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '-');
      onInputChange('slug', autoSlug);
    }
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newKeyword.trim()) {
        onArrayChange('seoKeywords', newKeyword.trim(), 'add');
        setNewKeyword('');
      }
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      onArrayChange('seoKeywords', newKeyword.trim(), 'add');
      setNewKeyword('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic SEO</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => onInputChange('seoTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              placeholder="Enter SEO title (50-60 characters recommended)"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.seoTitle.length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Description
            </label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => onInputChange('seoDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              placeholder="Enter SEO description (150-160 characters recommended)"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.seoDescription.length}/160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Keywords
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.seoKeywords.map((keyword: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => onArrayChange('seoKeywords', keyword, 'remove')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                placeholder="Enter keyword"
                onKeyPress={handleKeywordKeyPress}
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced SEO</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              onBlur={handleSlugBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              placeholder="product-url-slug"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly version of the product name
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canonical URL
            </label>
            <input
              type="url"
              value={formData.canonicalUrl}
              onChange={(e) => onInputChange('canonicalUrl', e.target.value)}
              placeholder="https://example.com/product/canonical-url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Prevent duplicate content issues
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Keyword
              </label>
              <input
                type="text"
                placeholder="Main target keyword"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Priority
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black">
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Social Media & Open Graph
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OG Title
              </label>
              <input
                type="text"
                value={formData.ogTitle}
                onChange={(e) => onInputChange('ogTitle', e.target.value)}
                placeholder="Title for social media sharing"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OG Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black">
                <option value="product">Product</option>
                <option value="website">Website</option>
                <option value="article">Article</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OG Description
            </label>
            <textarea
              value={formData.ogDescription}
              onChange={(e) => onInputChange('ogDescription', e.target.value)}
              rows={2}
              placeholder="Description for social media sharing"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OG Image URL
              </label>
              <input
                type="url"
                value={formData.ogImage}
                onChange={(e) => onInputChange('ogImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Card Type
              </label>
              <select
                value={formData.twitterCardMeta}
                onChange={(e) => onInputChange('twitterCardMeta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">
                  Summary with Large Image
                </option>
                <option value="product">Product</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Structured Data (Schema.org)
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableProductSchema"
              defaultChecked={true}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="enableProductSchema"
              className="ml-2 block text-sm text-gray-900"
            >
              Enable Product Schema
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableBreadcrumbSchema"
              defaultChecked={true}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="enableBreadcrumbSchema"
              className="ml-2 block text-sm text-gray-900"
            >
              Enable Breadcrumb Schema
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableReviewSchema"
              defaultChecked={false}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="enableReviewSchema"
              className="ml-2 block text-sm text-gray-900"
            >
              Enable Review Schema
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Schema (JSON-LD)
            </label>
            <textarea
              rows={4}
              placeholder="Enter custom JSON-LD schema..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Image SEO</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO-friendly Image Filename
            </label>
            <input
              type="text"
              value={formData.seoFriendlyImageFilename}
              onChange={(e) =>
                onInputChange('seoFriendlyImageFilename', e.target.value)
              }
              placeholder="product-name-key-feature.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use descriptive, keyword-rich filenames
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Alt Text
            </label>
            <textarea
              value={formData.imageAltText}
              onChange={(e) => onInputChange('imageAltText', e.target.value)}
              rows={3}
              placeholder="Describe the image content for accessibility and SEO"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Important for accessibility and image search ranking
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Structured Data (Schema)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Schema
            </label>
            <textarea
              value={formData.productSchema}
              onChange={(e) => onInputChange('productSchema', e.target.value)}
              rows={4}
              placeholder="JSON-LD Product schema markup"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Schema
            </label>
            <textarea
              value={formData.brandSchema}
              onChange={(e) => onInputChange('brandSchema', e.target.value)}
              rows={4}
              placeholder="JSON-LD Brand schema markup"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breadcrumb Schema
            </label>
            <textarea
              value={formData.breadcrumbSchema}
              onChange={(e) => onInputChange('breadcrumbSchema', e.target.value)}
              rows={4}
              placeholder="JSON-LD Breadcrumb schema markup"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ItemList Schema (for category pages)
            </label>
            <textarea
              value={formData.itemListSchema}
              onChange={(e) => onInputChange('itemListSchema', e.target.value)}
              rows={4}
              placeholder="JSON-LD ItemList schema markup"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FAQ Schema (if applicable)
            </label>
            <textarea
              value={formData.faqSchema}
              onChange={(e) => onInputChange('faqSchema', e.target.value)}
              rows={4}
              placeholder="JSON-LD FAQ schema markup"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Meta</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Title
            </label>
            <input
              type="text"
              value={formData.ogTitle}
              onChange={(e) => onInputChange('ogTitle', e.target.value)}
              placeholder="Title for social media sharing"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Description
            </label>
            <textarea
              value={formData.ogDescription}
              onChange={(e) => onInputChange('ogDescription', e.target.value)}
              rows={2}
              placeholder="Description for social media sharing"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Image
            </label>
            <input
              type="url"
              value={formData.ogImage}
              onChange={(e) => onInputChange('ogImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter Card Meta
            </label>
            <select
              value={formData.twitterCardMeta}
              onChange={(e) => onInputChange('twitterCardMeta', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
            >
              <option value="summary">Summary</option>
              <option value="summary_large_image">
                Summary with Large Image
              </option>
              <option value="product">Product</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Content Elements
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <RichTextEditor
              value={formData.productDescription}
              onChange={(value) => onInputChange('productDescription', value)}
              placeholder="Detailed product description for SEO"
              height={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FAQs
            </label>
            <RichTextEditor
              value={formData.faqs}
              onChange={(value) => onInputChange('faqs', value)}
              placeholder="Frequently asked questions and answers"
              height={200}
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical SEO</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Robots Meta Tag
              </label>
              <select
                value={formData.robotsMeta}
                onChange={(e) => onInputChange('robotsMeta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              >
                <option value="index,follow">Index, Follow</option>
                <option value="index,nofollow">Index, No Follow</option>
                <option value="noindex,follow">No Index, Follow</option>
                <option value="noindex,nofollow">No Index, No Follow</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black">
                <option value="en">English</option>
                <option value="ne">Nepali</option>
                <option value="hi">Hindi</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geographic Target
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black">
                <option value="">Global</option>
                <option value="NP">Nepal</option>
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Rating
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black">
                <option value="general">General</option>
                <option value="mature">Mature</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Meta Tags
            </label>
            <textarea
              rows={3}
              placeholder='name="custom-meta" content="value"'
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add custom meta tags (one per line)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

SeoTab.displayName = 'SeoTab';

export { validateSeo };
export default SeoTab;
