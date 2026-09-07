'use client';

import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { ContactPageFormData } from '@/features/contact-page';
import { useContactPage } from '@/features/contact-page';

const DEFAULT_FORM: ContactPageFormData = {
  pageTitle: 'GET IN TOUCH WITH US',
  pageSubtitle: '',
  email: 'support@rapharch.com',
  phone: '+1 (212) 555-0189',
  subjectOptions: 'order,product,shipping,return,technical,other',
  successTitle: 'Message Sent!',
  successMessage: 'Thank you for reaching out. Our team will get back to you within 48 hours.',
  isActive: true,
};

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm text-black';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

const SUBJECT_LABELS: Record<string, string> = {
  order: 'Order Inquiry',
  product: 'Product Question',
  shipping: 'Shipping Information',
  return: 'Return & Exchange',
  technical: 'Technical Support',
  other: 'Other',
};

export default function ContactPageSettings() {
  const { settings, isLoading, isSaving, save } = useContactPage();
  const [form, setForm] = useState<ContactPageFormData>(DEFAULT_FORM);

  useEffect(() => {
    if (settings) {
      setForm({
        pageTitle: settings.pageTitle || '',
        pageSubtitle: settings.pageSubtitle || '',
        email: settings.email || '',
        phone: settings.phone || '',
        subjectOptions: settings.subjectOptions || '',
        successTitle: settings.successTitle || '',
        successMessage: settings.successMessage || '',
        isActive: settings.isActive,
      });
    }
  }, [settings]);

  const handleChange = (field: keyof ContactPageFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await save(form);
  };

  const parsedSubjects = form.subjectOptions
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <DashboardLayout title="Contact Page">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Contact Page Settings</h1>
            <p className="text-black text-lg mt-2">Manage the contact page content and form options</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Page Header</h2>
              <div>
                <label className={labelCls}>Page Title</label>
                <input type="text" value={form.pageTitle || ''} onChange={(e) => handleChange('pageTitle', e.target.value)} className={inputCls} placeholder="GET IN TOUCH WITH US" />
              </div>
              <div>
                <label className={labelCls}>Page Subtitle</label>
                <input type="text" value={form.pageSubtitle || ''} onChange={(e) => handleChange('pageSubtitle', e.target.value)} className={inputCls} placeholder="We'd love to hear from you..." />
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input type="email" value={form.email || ''} onChange={(e) => handleChange('email', e.target.value)} className={inputCls} placeholder="support@rapharch.com" />
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input type="text" value={form.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className={inputCls} placeholder="+1 (212) 555-0189" />
                </div>
              </div>
            </div>

            {/* Subject Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Subject Options</h2>
              <div>
                <label className={labelCls}>Subject Options (comma-separated keys)</label>
                <input type="text" value={form.subjectOptions} onChange={(e) => handleChange('subjectOptions', e.target.value)} className={inputCls} placeholder="order,product,shipping,return,technical,other" />
                <p className="text-xs text-gray-400 mt-1">Keys map to labels: {parsedSubjects.map((s) => `${s} → ${SUBJECT_LABELS[s] || s}`).join(', ')}</p>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Success Message</h2>
              <div>
                <label className={labelCls}>Success Title</label>
                <input type="text" value={form.successTitle || ''} onChange={(e) => handleChange('successTitle', e.target.value)} className={inputCls} placeholder="Message Sent!" />
              </div>
              <div>
                <label className={labelCls}>Success Message</label>
                <textarea value={form.successMessage || ''} onChange={(e) => handleChange('successMessage', e.target.value)} rows={2} className={inputCls} placeholder="Thank you for reaching out..." />
              </div>
            </div>

            {/* Active toggle + Save */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} className="h-4 w-4 accent-[#D4AF37] rounded" />
                <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Active</label>
              </div>
              <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#D4AF37] rounded-lg hover:bg-[#b8962e] transition-colors disabled:opacity-50 shadow-sm">
                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
