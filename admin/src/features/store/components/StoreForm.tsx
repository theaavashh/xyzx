'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Building2, MapPin, Phone, Mail, ImageIcon, Link, Clock, Plus, Save, Trash2, X, Globe, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import type { StoreSection, StoreHours } from '../types';

interface StoreFormProps {
  storeData: StoreSection;
  isEditing: boolean;
  isSaving: boolean;
  isUploading: boolean;
  onInputChange: (field: keyof StoreSection, value: string | boolean | StoreHours[]) => void;
  onSave: () => void;
  onCancel: () => void;
  onToggleEdit: () => void;
  onImageUpload: () => void;
}

export function StoreForm({
  storeData,
  isEditing,
  isSaving,
  isUploading,
  onInputChange,
  onSave,
  onCancel,
  onToggleEdit,
  onImageUpload,
}: StoreFormProps) {
  const [showPreview, setShowPreview] = useState(true);

  const addHour = () => {
    const newHour: StoreHours = { days: '', hours: '' };
    onInputChange('hours', [...storeData.hours, newHour]);
  };

  const removeHour = (index: number) => {
    const updated = storeData.hours.filter((_, i) => i !== index);
    onInputChange('hours', updated);
  };

  const updateHour = (index: number, field: keyof StoreHours, value: string) => {
    const updated = storeData.hours.map((h, i) =>
      i === index ? { ...h, [field]: value } : h,
    );
    onInputChange('hours', updated);
  };

  const inputClass = (disabled?: boolean) =>
    `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm transition-shadow ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white text-black'}`;

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  const sectionCard = 'bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm';

  const sectionHeader = 'text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Section</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store information displayed on the website</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              showPreview
                ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          {!isEditing && (
            <button
              onClick={onToggleEdit}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Edit Store
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${storeData.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {storeData.isActive ? 'Published' : 'Draft'}
          </div>
          <span className="text-sm text-gray-500">Status</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-600 font-medium">Active</span>
          <input
            type="checkbox"
            checked={storeData.isActive}
            onChange={(e) => onInputChange('isActive', e.target.checked)}
            disabled={!isEditing}
            className="w-4 h-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] disabled:opacity-50"
          />
        </label>
      </div>

      {showPreview && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Frontend Preview</span>
            <span className="text-xs text-gray-400">~ {storeData.title || 'Visit Our Store'}</span>
          </div>
          <div className="p-6 md:p-10">
            <section className="bg-white">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
                  {storeData.title || 'Visit Our Store'}
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed font-light px-2">
                  {storeData.description || 'Your store description will appear here'}
                </p>
              </div>

              {storeData.image && (
                <div className="relative w-full rounded-xl md:rounded-3xl overflow-hidden bg-gray-100">
                  <Image
                    src={storeData.image}
                    alt={storeData.title || 'Store'}
                    width={1450}
                    height={1085}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div className="space-y-4">
                  <h3 className="text-2xl text-gray-900 mb-4">Contact & Location</h3>

                  <div className="flex items-start gap-3 text-gray-500">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>
                      {storeData.address || '123 Main Street'}, {storeData.city || 'City'}, {storeData.state || 'State'} {storeData.zip || 'ZIP'}
                    </span>
                  </div>

                  {storeData.phone && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Phone className="w-5 h-5 flex-shrink-0" />
                      <span>{storeData.phone}</span>
                    </div>
                  )}

                  {storeData.email && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Mail className="w-5 h-5 flex-shrink-0" />
                      <span>{storeData.email}</span>
                    </div>
                  )}

                  {storeData.hours.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center gap-3 text-gray-900 font-semibold mb-2">
                        <Clock className="w-5 h-5" />
                        <span>Store Hours</span>
                      </div>
                      <div className="space-y-1 text-gray-500 text-sm">
                        {storeData.hours.filter(h => h.isActive !== false).map((h, i) => (
                          <div key={i} className="flex justify-between max-w-xs">
                            <span className="font-medium">{h.days}</span>
                            <span>{h.hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                  </div>
                </div>

                {storeData.mapEmbedUrl ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <iframe
                      src={storeData.mapEmbedUrl}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="Store Location"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center h-[300px]">
                    <div className="text-center text-gray-400">
                      <Globe className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-sm">No map embed URL configured</p>
                    </div>
                  </div>
                )}
              </div>

              {storeData.ctaText && (
                <div className="text-center mt-10">
                  <div className="inline-block bg-[#D4AF37] text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded-sm">
                    {storeData.ctaText}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="space-y-6">
          <div className={sectionCard}>
            <h2 className={sectionHeader}>
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              Page Header
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Page Title</label>
                <input
                  type="text"
                  value={storeData.pageTitle || ''}
                  onChange={(e) => onInputChange('pageTitle', e.target.value)}
                  className={inputClass()}
                  placeholder="VISIT US"
                />
              </div>
              <div>
                <label className={labelClass}>Page Description</label>
                <textarea
                  value={storeData.pageDescription || ''}
                  onChange={(e) => onInputChange('pageDescription', e.target.value)}
                  rows={2}
                  className={inputClass()}
                  placeholder="Experience RaphArch firsthand..."
                />
              </div>
            </div>
          </div>

          <div className={sectionCard}>
            <h2 className={sectionHeader}>
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              Store Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Store Title *</label>
                <input
                  type="text"
                  value={storeData.title}
                  onChange={(e) => onInputChange('title', e.target.value)}
                  className={inputClass()}
                  placeholder="Visit Our Store"
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={storeData.description}
                  onChange={(e) => onInputChange('description', e.target.value)}
                  rows={3}
                  className={inputClass()}
                  placeholder="Describe your store location"
                />
              </div>
            </div>
          </div>

          <div className={sectionCard}>
            <h2 className={sectionHeader}>
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Street Address</label>
                <input
                  type="text"
                  value={storeData.address}
                  onChange={(e) => onInputChange('address', e.target.value)}
                  className={inputClass()}
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <input
                  type="text"
                  value={storeData.city}
                  onChange={(e) => onInputChange('city', e.target.value)}
                  className={inputClass()}
                  placeholder="New York"
                />
              </div>
              <div>
                <label className={labelClass}>State *</label>
                <input
                  type="text"
                  value={storeData.state}
                  onChange={(e) => onInputChange('state', e.target.value)}
                  className={inputClass()}
                  placeholder="NY"
                />
              </div>
              <div>
                <label className={labelClass}>ZIP Code</label>
                <input
                  type="text"
                  value={storeData.zip}
                  onChange={(e) => onInputChange('zip', e.target.value)}
                  className={inputClass()}
                  placeholder="10001"
                />
              </div>
              <div>
                <label className={labelClass}>Country *</label>
                <input
                  type="text"
                  value={storeData.country}
                  onChange={(e) => onInputChange('country', e.target.value)}
                  className={inputClass()}
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          <div className={sectionCard}>
            <h2 className={sectionHeader}>
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="text"
                  value={storeData.phone || ''}
                  onChange={(e) => onInputChange('phone', e.target.value)}
                  className={inputClass()}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={storeData.email || ''}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  className={inputClass()}
                  placeholder="store@rapharch.com"
                />
              </div>
            </div>
          </div>

          <div className={sectionCard}>
            <h2 className={sectionHeader}>
              <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
              Media
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Store Image</label>
                {isEditing ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={onImageUpload}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-white transition-colors disabled:opacity-50"
                    >
                      <ImageIcon className="w-4 h-4" />
                      {isUploading ? 'Uploading...' : storeData.image ? 'Change Image' : 'Upload Image'}
                    </button>
                    {storeData.image && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={storeData.image}
                          alt="Store preview"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                ) : storeData.image ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={storeData.image}
                      alt="Store preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300">
                    <p className="text-sm text-gray-400">No image uploaded</p>
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>Google Maps Embed URL</label>
                <input
                  type="text"
                  value={storeData.mapEmbedUrl || ''}
                  onChange={(e) => onInputChange('mapEmbedUrl', e.target.value)}
                  className={inputClass()}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <p className="text-xs text-gray-400 mt-1.5">Paste the full embed src URL from Google Maps</p>
              </div>
            </div>
          </div>

          <div className={sectionCard}>
            <h2 className={sectionHeader}>
              <Link className="w-4 h-4 text-[#D4AF37]" />
              Call to Action
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>CTA Text *</label>
                <input
                  type="text"
                  value={storeData.ctaText}
                  onChange={(e) => onInputChange('ctaText', e.target.value)}
                  className={inputClass()}
                  placeholder="Get Directions"
                />
              </div>
              <div>
                <label className={labelClass}>CTA URL *</label>
                <input
                  type="text"
                  value={storeData.ctaUrl}
                  onChange={(e) => onInputChange('ctaUrl', e.target.value)}
                  className={inputClass()}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </div>

          <div className={sectionCard}>
            <div className="flex items-center justify-between">
              <h2 className={sectionHeader}>
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                Business Hours
              </h2>
              <button
                onClick={addHour}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Hours
              </button>
            </div>
            <div className="space-y-3">
              {storeData.hours.map((hour, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                  <div className="flex-1">
                    <label className={labelClass}>Days</label>
                    <input
                      type="text"
                      value={hour.days}
                      onChange={(e) => updateHour(index, 'days', e.target.value)}
                      className={inputClass()}
                      placeholder="Mon - Fri"
                    />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Hours</label>
                    <input
                      type="text"
                      value={hour.hours}
                      onChange={(e) => updateHour(index, 'hours', e.target.value)}
                      className={inputClass()}
                      placeholder="9:00 AM - 6:00 PM"
                    />
                  </div>
                  <button
                    onClick={() => removeHour(index)}
                    className="mt-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {storeData.hours.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-4">No hours added yet.</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 bg-gray-50 rounded-xl border border-gray-200 p-4">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
