'use client';

import { Edit3, Eye, Save, X } from 'lucide-react';
import { sanitizeHtml } from '@/utils/sanitize';
import RichTextEditor from '@/components/RichTextEditor';
import type { AboutUsData } from '../types';

interface AboutFormProps {
  aboutData: AboutUsData;
  isEditing: boolean;
  isSaving: boolean;
  previewMode: boolean;
  onInputChange: (field: keyof AboutUsData, value: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  onTogglePreview: () => void;
  onToggleEdit: () => void;
}

export function AboutForm({
  aboutData,
  isEditing,
  isSaving,
  previewMode,
  onInputChange,
  onSave,
  onCancel,
  onTogglePreview,
  onToggleEdit,
}: AboutFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Us Page</h1>
          <p className="text-gray-600">
            Manage your website&apos;s about us content
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onTogglePreview}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          {!isEditing && !previewMode && (
            <button
              onClick={onToggleEdit}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${aboutData.isActive ? 'bg-green-500' : 'bg-red-500'}`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {aboutData.isActive ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Last updated:{' '}
              {aboutData.lastUpdated
                ? new Date(aboutData.lastUpdated).toLocaleString()
                : 'Never'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={aboutData.isActive}
                onChange={(e) =>
                  onInputChange('isActive', e.target.checked)
                }
                disabled={!isEditing}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {aboutData.title}
            </h1>
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(aboutData.content.replace(/\n/g, '<br>')),
              }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title *
                </label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => onInputChange('title', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Enter page title"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Page Content
            </h2>
            <RichTextEditor
              value={aboutData.content}
              onChange={(value) => onInputChange('content', value)}
              placeholder="Write your about us content here..."
              height={600}
              className="min-h-[600px]"
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              SEO Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={aboutData.metaTitle}
                  onChange={(e) =>
                    onInputChange('metaTitle', e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Enter meta title for SEO"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {aboutData.metaTitle.length}/60 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={aboutData.metaDescription}
                  onChange={(e) =>
                    onInputChange('metaDescription', e.target.value)
                  }
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Enter meta description for SEO"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {aboutData.metaDescription.length}/160 characters
                </p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end space-x-3 bg-gray-50 rounded-lg p-4">
              <button
                onClick={onCancel}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={
                  isSaving ||
                  !aboutData.title.trim() ||
                  !aboutData.content.trim()
                }
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
