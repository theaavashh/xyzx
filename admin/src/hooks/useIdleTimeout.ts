'use client';

import { useCallback, useEffect, useRef } from 'react';

const IDLE_TIMEOUT_MS = 3 * 60 * 60 * 1000;

interface UseIdleTimeoutOptions {
  onIdle: () => void;
  isEnabled?: boolean;
}

export function useIdleTimeout({ onIdle, isEnabled = true }: UseIdleTimeoutOptions) {
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(0);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      if (timeSinceLastActivity >= IDLE_TIMEOUT_MS) {
        onIdle();
      }
    }, IDLE_TIMEOUT_MS);
  }, [clearIdleTimer, onIdle]);

  useEffect(() => {
    if (!isEnabled) return;

    const events = ['mousedown', 'keydown', 'scroll', 'mousemove', 'touchstart', 'click'];

    const handleActivity = () => {
      resetIdleTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetIdleTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearIdleTimer();
    };
  }, [resetIdleTimer, clearIdleTimer, isEnabled]);

  return { clearIdleTimer, resetIdleTimer };
}
