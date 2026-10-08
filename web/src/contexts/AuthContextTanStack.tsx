'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import type { User } from '@/lib/dashboard/types';
import { csrfHeaders } from '@/utils/csrf';

export interface AuthResult {
  success: boolean;
  requiresOtp?: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  verifyOtp: (email: string, otp: string) => Promise<AuthResult>;
  resendOtp: (email: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
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

const API_BASE = typeof window !== 'undefined' ? '' : (process.env.API_BASE_URL || 'http://localhost:9999');

async function fetchWithCredentials(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> | undefined),
        ...csrfHeaders(options.method),
      },
    });
    
    if (!response.ok && response.status !== 401) {
      console.error(`Auth API Error [${response.status}] ${endpoint}`);
    }
    
    return response;
  } catch (error) {
    console.error(`Auth Fetch Error ${endpoint}:`, error);
    throw error;
  }
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
        },
        mutations: {
          retry: false,
        },
      },
    });
  }
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
        },
        mutations: {
          retry: false,
        },
      },
    });
  }
  return browserQueryClient;
}

export const queryClient = getQueryClient();

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const scheduleRefresh = useCallback(() => {
    clearRefreshTimer();
    refreshTimerRef.current = setTimeout(() => {
      refreshSession();
    }, 15 * 60 * 1000);
  }, [clearRefreshTimer]);

  const setUserAndCache = useCallback((userData: User) => {
    setUser(userData);
    queryClient.setQueryData(['auth', 'profile'], userData);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetchWithCredentials('/api/v1/auth/refresh', {
        method: 'POST',
      });

      if (response.ok) {
        const profileRes = await fetchWithCredentials('/api/v1/auth/profile');
        if (profileRes.ok) {
          const data = await profileRes.json();
          if (data.success && data.data) {
            setUserAndCache(data.data);
            scheduleRefresh();
          }
        }
      } else {
        setUser(null);
        queryClient.removeQueries({ queryKey: ['auth', 'profile'] });
        clearRefreshTimer();
      }
    } catch {
      setUser(null);
      queryClient.removeQueries({ queryKey: ['auth', 'profile'] });
      clearRefreshTimer();
    }
  }, [scheduleRefresh, clearRefreshTimer, setUserAndCache]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const response = await fetchWithCredentials('/api/v1/auth/profile');

        if (response.ok) {
          const data = await response.json();
          if (mounted && data.success && data.data) {
            setUserAndCache(data.data);
            scheduleRefresh();
          }
        }
      } catch {
        // Silently fail - user is not authenticated
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      clearRefreshTimer();
    };
  }, [scheduleRefresh, clearRefreshTimer, setUserAndCache]);

  const loadProfile = useCallback(async () => {
    const profileRes = await fetchWithCredentials('/api/v1/auth/profile');
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      if (profileData.success && profileData.data) {
        setUserAndCache(profileData.data);
        scheduleRefresh();
      }
    }
  }, [scheduleRefresh, setUserAndCache]);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      const response = await fetchWithCredentials('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Invalid email or password. Please try again.' };
      }

      if (data.data?.requiresOtp) {
        return { success: false, requiresOtp: true };
      }

      await loadProfile();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error && err.message ? err.message : 'Login failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      const response = await fetchWithCredentials('/api/v1/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Invalid or expired OTP. Please try again.' };
      }

      await loadProfile();
      return { success: true };
    } catch {
      return { success: false, error: 'Unable to verify OTP. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string): Promise<AuthResult> => {
    try {
      const response = await fetchWithCredentials('/api/v1/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Unable to resend OTP. Please try again.' };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Unable to resend OTP. Please try again.' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      const response = await fetchWithCredentials('/api/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Signup failed' };
      }

      toast.success('Account created successfully!');
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetchWithCredentials('/api/v1/auth/logout', {
        method: 'POST',
      });
    } catch {
      // Continue logout even if API fails
    } finally {
      setUser(null);
      queryClient.removeQueries({ queryKey: ['auth'] });
      queryClient.removeQueries({ queryKey: ['dashboard'] });
      clearRefreshTimer();
      toast.success('Logged out successfully');
      window.location.href = '/';
    }
  };

  const isAuthenticated = !!user;

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      verifyOtp,
      resendOtp,
      signup,
      logout,
      isLoading,
      isAuthenticated,
      refreshSession,
    }),
    [user, isLoading, isAuthenticated, refreshSession],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
};
