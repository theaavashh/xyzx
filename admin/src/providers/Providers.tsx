'use client';

import { AuthProvider } from '@/contexts/AuthContextTanStack';
import { CsrfInitializer } from '@/components/CsrfInitializer';
import type React from 'react';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <CsrfInitializer />
      {children}
    </AuthProvider>
  );
};
