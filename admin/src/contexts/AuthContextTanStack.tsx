'use client';

import {
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { createContext, useContext, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { User } from '@/types';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import { fetchProfile, loginRequest, logoutRequest, tokenRefreshManager } from '@/services/apiClient';

export type { User };
export { queryClient };

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProviderInner: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();

  const logout = useCallback(async (): Promise<void> => {
    queryClient.setQueryData(['profile'], null);
    try {
      await logoutRequest();
    } catch {
      // Ignore logout errors
    }
    tokenRefreshManager.reset();
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.replace('/');
  }, [router]);

  const handleIdleLogout = useCallback(() => {
    queryClient.setQueryData(['profile'], null);
    tokenRefreshManager.reset();
    toast.error('Session expired due to inactivity. Please log in again.');
    router.push('/');
  }, [router]);

  const { data: userData, isLoading: isQueryLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const response = await fetchProfile();

        if (!response) {
          return null;
        }

        if (response.success && response.data) {
          return response.data as User;
        }
        return null;
      } catch {
        return null;
      }
    },
    enabled: typeof document !== 'undefined',
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginRequest(email, password);

      if (response.success) {
        toast.success('OTP sent to your email');
        return true;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
      return false;
    }
  }, [refetchProfile]);

  useIdleTimeout({ onIdle: handleIdleLogout });
  useTokenRefresh({ onLogout: () => {} });

  const user = userData || null;
  const isAuthenticated = !!user;

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout,
      isLoading: isQueryLoading,
      isAuthenticated,
      refetchProfile,
    }),
    [user, login, logout, isQueryLoading, isAuthenticated, refetchProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </QueryClientProvider>
  );
};
