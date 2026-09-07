'use client';

import { useEffect, useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import { useShortDescription } from '@/features/short-description';

export default function ShortDescriptionPage() {
  const { loading, fetchDescription, saveDescription } = useShortDescription();
  const [description, setDescription] = useState('');

  useEffect(() => {
    (async () => {
      const data = await fetchDescription();
      setDescription(data);
    })();
  }, [fetchDescription]);

  const handleSave = async () => {
    await saveDescription(description);
  };

  return (
    <PageTemplate title="Short Description">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-black">Short Description</h2>
            <p className="text-sm text-gray-500 mt-1">Manage the storefront short description</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8960C] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm transition-colors"
          >
            {loading ? 'Saving...' : 'Save Description'}
          </button>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter the short description shown on the storefront"
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none resize-y placeholder:text-gray-400"
        />
      </div>
    </PageTemplate>
  );
}
