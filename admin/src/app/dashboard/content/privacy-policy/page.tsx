'use client';

import { useEffect, useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import RichTextEditor from '@/components/RichTextEditor';
import { useContentPageQueries } from '@/features/content';

export default function PrivacyPolicyPage() {
  const { loading, fetchContent, saveContent } = useContentPageQueries({
    fetchPath: '/api/v1/content/slug/privacy-policy',
    savePath: '/api/v1/content/privacy-policy',
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
    <PageTemplate title="Privacy Policy">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-black">Privacy Policy Editor</h2>
            <p className="text-sm text-gray-500 mt-1">Edit your privacy policy content</p>
          </div>
          <button onClick={handleSave} disabled={loading}
            className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8960C] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm transition-colors">
            {loading ? 'Saving...' : 'Save Policy'}
          </button>
        </div>
        <RichTextEditor value={content} onChange={setContent} placeholder="Enter privacy policy content..." height={600} />
      </div>
    </PageTemplate>
  );
}
