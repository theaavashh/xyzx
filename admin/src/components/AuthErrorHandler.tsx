'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

let isRedirecting = false;

export default function AuthErrorHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const redirectRef = useRef(false);

  useEffect(() => {
    const handle401 = () => {
      if (!redirectRef.current && !isRedirecting) {
        redirectRef.current = true;
        isRedirecting = true;
        toast.error('Session expired. Please log in again.');
        router.push('/');
        setTimeout(() => {
          redirectRef.current = false;
          isRedirecting = false;
        }, 3000);
      }
    };

    window.addEventListener('auth:401', handle401);
    return () => window.removeEventListener('auth:401', handle401);
  }, [router]);

  return <>{children}</>;
}
