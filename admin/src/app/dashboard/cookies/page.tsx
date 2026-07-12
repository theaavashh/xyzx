'use client';

import { useEffect, useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import RichTextEditor from '@/components/RichTextEditor';
import { useCookiesQueries } from '@/features/cookies';

export default function CookiePolicyPage() {
  const { loading, fetchContent, saveContent } = useCookiesQueries();
  const [initialContent, setInitialContent] = useState('');

  useEffect(() => {
    (async () => {
      const data = await fetchContent();
      setInitialContent(data);
    })();
  }, [fetchContent]);

  const handleManualSave = async () => {
    await saveContent(initialContent);
  };

  return (
    <PageTemplate title="Cookie Policy">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-black outer-sans">Cookie Policy Editor</h2>
          <button onClick={handleManualSave} disabled={loading}
            className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
            {loading ? 'Saving...' : 'Save Policy'}
          </button>
        </div>
        <RichTextEditor value={initialContent} onChange={setInitialContent} placeholder="Enter cookie policy content..." height={600} />
      </div>
    </PageTemplate>
  );
}
