'use client';

import { useEffect } from 'react';
import { setCsrfToken } from '@/utils/csrf';

const CSRF_COOKIE_NAME = 'csrf-token';

export function CsrfInitializer() {
  useEffect(() => {
    const hasCookie = document.cookie
      .split(';')
      .some((c) => c.trim().startsWith(`${CSRF_COOKIE_NAME}=`));

    if (!hasCookie) {
      setCsrfToken();
    }
  }, []);

  return null;
}
