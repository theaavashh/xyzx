'use client';

import { useEffect, useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import RichTextEditor from '@/components/RichTextEditor';
import { useContentPageQueries } from '@/features/content';

export default function TermsOfServicePage() {
  const { loading, fetchContent, saveContent } = useContentPageQueries({
    fetchPath: '/api/v1/content/slug/terms-of-service',
    savePath: '/api/v1/content/terms-of-service',
  });
  const [content, setContent] = useState('');

  useEffect(() => {
    (async () => {
      const data = await fetchContent();
      setContent(data);
    })();
  }, [fetchContent]);

  const handleSave = async () => {
    await saveContent(content);
  };

  return (
    <PageTemplate title="Terms of Service">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-black lastik">Terms of Service Editor</h2>
            <p className="text-sm text-gray-500 mt-1">Edit your terms of service content</p>
          </div>
          <button onClick={handleSave} disabled={loading}
            className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8960C] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm transition-colors">
            {loading ? 'Saving...' : 'Save Policy'}
          </button>
        </div>
        <RichTextEditor value={content} onChange={setContent} placeholder="Enter terms of service content..." height={600} />
      </div>
    </PageTemplate>
  );
}
