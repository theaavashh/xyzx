'use client';

import { useCallback, useEffect, useRef } from 'react';
import { queryClient } from '@/lib/queryClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { tokenRefreshManager } from '@/services/apiClient';
import { clearAccessToken } from '@/utils/authToken';

interface UseTokenRefreshOptions {
  onLogout: () => void;
}

export function useTokenRefresh({ onLogout }: UseTokenRefreshOptions) {
  const router = useRouter();
  const isHandlingRef = useRef(false);

  const forceLogout = useCallback(() => {
    queryClient.setQueryData(['profile'], null);
    toast.error('Session expired. Please log in again.');
    router.replace('/');
  }, [router]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isHandlingRef.current) return false;
    if (tokenRefreshManager.hasFailed()) return false;
    isHandlingRef.current = true;
    try {
      await tokenRefreshManager.refreshToken();
      return true;
    } catch {
      forceLogout();
      return false;
    } finally {
      isHandlingRef.current = false;
    }
  }, [forceLogout]);

  useEffect(() => {
    const handleAuth401 = () => {
      if (isHandlingRef.current) return;
      isHandlingRef.current = true;
      clearAccessToken();
      forceLogout();
    };

    window.addEventListener('auth:401', handleAuth401);

    return () => {
      window.removeEventListener('auth:401', handleAuth401);
    };
  }, [forceLogout]);

  return { refreshToken, forceLogout };
}
