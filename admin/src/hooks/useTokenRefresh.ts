'use client';

import { useCallback, useEffect, useRef } from 'react';
import { queryClient } from '@/lib/queryClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { tokenRefreshManager } from '@/services/apiClient';
import { clearAccessToken, getAccessToken } from '@/utils/authToken';

interface UseTokenRefreshOptions {
  onLogout: () => void;
}

/** Renew the access token before it expires so requests never see a 401. */
const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export function useTokenRefresh({ onLogout }: UseTokenRefreshOptions) {
  const router = useRouter();
  const isHandlingRef = useRef(false);

  const forceLogout = useCallback(() => {
    queryClient.setQueryData(['profile'], null);
    clearAccessToken();
    toast.error('Session expired. Please log in again.');
    router.replace('/');
  }, [router]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isHandlingRef.current) return false;

    if (tokenRefreshManager.hasFailed()) {
      forceLogout();
      return false;
    }

    isHandlingRef.current = true;
    try {
      await tokenRefreshManager.refreshToken();
      return true;
    } catch {
      // Only sign out when the refresh token itself was rejected; a
      // network error keeps the session so it can recover on retry.
      if (tokenRefreshManager.hasFailed()) {
        forceLogout();
        return false;
      }
      return false;
    } finally {
      isHandlingRef.current = false;
    }
  }, [forceLogout]);

  useEffect(() => {
    const handleAuth401 = () => {
      if (isHandlingRef.current) return;
      isHandlingRef.current = true;
      forceLogout();
    };

    window.addEventListener('auth:401', handleAuth401);

    return () => {
      window.removeEventListener('auth:401', handleAuth401);
    };
  }, [forceLogout]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!getAccessToken() || tokenRefreshManager.hasFailed()) return;
      void refreshToken();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(id);
  }, [refreshToken]);

  return { refreshToken, forceLogout };
}
