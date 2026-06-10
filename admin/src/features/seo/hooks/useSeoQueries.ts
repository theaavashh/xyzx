import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '@/utils/api';
import { clientLogger } from '@/lib/logger';
import type { JsonLdScript, SitemapUrl, RobotRule, SitemapConfig } from '../types';

const BASE = '/api/v1/json-ld';

export function useJsonLdQueries() {
  const [loading, setLoading] = useState(false);

  const fetchScripts = useCallback(async (): Promise<JsonLdScript[]> => {
    try {
      const res = await apiRequest<{ success: boolean; data: JsonLdScript[] }>(BASE);
      return res.data ?? [];
    } catch (error) {
      clientLogger.error('Error fetching JSON-LD scripts:', error);
      return [];
    }
  }, []);

  const createScript = useCallback(async (script: Partial<JsonLdScript>): Promise<JsonLdScript | null> => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: JsonLdScript }>(BASE, 'POST', script);
      toast.success('Script created successfully');
      return res.data ?? null;
    } catch (error) {
      clientLogger.error('Error creating JSON-LD script:', error);
      toast.error('Failed to create script');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateScript = useCallback(async (id: string, script: Partial<JsonLdScript>): Promise<JsonLdScript | null> => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: JsonLdScript }>(`${BASE}/${id}`, 'PUT', script);
      toast.success('Script updated successfully');
      return res.data ?? null;
    } catch (error) {
      clientLogger.error('Error updating JSON-LD script:', error);
      toast.error('Failed to update script');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteScript = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await apiRequest(`${BASE}/${id}`, 'DELETE');
      toast.success('Script deleted successfully');
      return true;
    } catch (error) {
      clientLogger.error('Error deleting JSON-LD script:', error);
      toast.error('Failed to delete script');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTypes = useCallback(async (): Promise<string[]> => {
    try {
      const res = await apiRequest<{ success: boolean; data: string[] }>(`${BASE}/types`);
      return res.data ?? [];
    } catch {
      return [];
    }
  }, []);

  const fetchPages = useCallback(async (): Promise<string[]> => {
    try {
      const res = await apiRequest<{ success: boolean; data: string[] }>(`${BASE}/pages`);
      return res.data ?? [];
    } catch {
      return [];
    }
  }, []);

  return { loading, fetchScripts, createScript, updateScript, deleteScript, fetchTypes, fetchPages };
}

export function useRobotsQueries() {
  const [loading, setLoading] = useState(false);

  const fetchRobots = useCallback(async (): Promise<string | null> => {
    try {
      const res = await apiRequest<{ success: boolean; data: { content: string } }>('/api/v1/seo/robots');
      return res.data?.content ?? null;
    } catch (error) {
      clientLogger.error('Error fetching robots.txt:', error);
      return null;
    }
  }, []);

  const saveRobots = useCallback(async (content: string) => {
    setLoading(true);
    try {
      await apiRequest('/api/v1/seo/robots', 'POST', { content });
      toast.success('robots.txt saved successfully');
    } catch (error) {
      clientLogger.error('Error saving robots.txt:', error);
      toast.error('Failed to save robots.txt');
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, fetchRobots, saveRobots };
}

export type { RobotRule, SitemapConfig };
