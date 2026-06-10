import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';

export function useCookiesQueries() {
  const [loading, setLoading] = useState(false);

  const fetchContent = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('/api/content/cookie-policy');
      if (response.ok) {
        const data = await response.json();
        return data.content || '';
      }
      return '';
    } catch (error) {
      clientLogger.error('Error fetching cookie policy:', error);
      toast.error('Failed to load cookie policy content');
      return '';
    }
  }, []);

  const saveContent = useCallback(async (content: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/content/cookie-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        toast.success('Cookie policy updated successfully');
        return true;
      }
      throw new Error('Failed to save cookie policy');
    } catch (error) {
      clientLogger.error('Error saving cookie policy:', error);
      toast.error('Failed to save cookie policy');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, fetchContent, saveContent };
}
