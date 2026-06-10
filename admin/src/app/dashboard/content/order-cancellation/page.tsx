'use client';

import { useEffect, useState } from 'react';
import PageTemplate from '@/components/PageTemplate';
import RichTextEditor from '@/components/RichTextEditor';
import { useContentPageQueries } from '@/features/content';

export default function OrderCancellationPage() {
  const { loading, fetchContent, saveContent } = useContentPageQueries({
    fetchPath: '/api/content/order-cancellation',
    savePath: '/api/content/order-cancellation',
  });
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
    <PageTemplate title="Order Cancellation">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-black lastik">Order Cancellation Policy Editor</h2>
          <button onClick={handleManualSave} disabled={loading}
            className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8962e] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Saving...' : 'Save Policy'}
          </button>
        </div>
        <RichTextEditor value={initialContent} onChange={setInitialContent} placeholder="Enter order cancellation policy content..." height={600} />
      </div>
    </PageTemplate>
  );
}
