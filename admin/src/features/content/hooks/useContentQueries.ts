import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';

interface ContentApiPaths {
  fetchPath: string;
  savePath: string;
  method?: 'POST' | 'PUT';
}

export function useContentPageQueries(apiPaths: ContentApiPaths) {
  const [loading, setLoading] = useState(false);

  const fetchContent = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch(apiPaths.fetchPath);
      if (response.ok) {
        const json = await response.json();
        return json.data?.content || '';
      }
      return '';
    } catch (error) {
      clientLogger.error(`Error fetching content from ${apiPaths.fetchPath}:`, error);
      toast.error('Failed to load content');
      return '';
    }
  }, [apiPaths.fetchPath]);

  const saveContent = useCallback(async (content: string) => {
    setLoading(true);
    try {
      const response = await fetch(apiPaths.savePath, {
        method: apiPaths.method || 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        toast.success('Content updated successfully');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      clientLogger.error(`Error saving content to ${apiPaths.savePath}:`, error);
      toast.error('Failed to save content');
    } finally {
      setLoading(false);
    }
  }, [apiPaths.savePath, apiPaths.method]);

  return { loading, fetchContent, saveContent };
}
