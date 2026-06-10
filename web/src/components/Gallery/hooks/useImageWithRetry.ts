"use client";

import { useCallback, useState } from 'react';

interface UseImageWithRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number) => void;
}

interface UseImageWithRetryReturn {
  isLoading: boolean;
  hasError: boolean;
  retryCount: number;
  handleLoad: () => void;
  handleError: () => void;
  retry: () => void;
  reset: () => void;
}

export function useImageWithRetry({
  maxRetries = 3,
  retryDelay = 1000,
  onRetry,
}: UseImageWithRetryOptions = {}): UseImageWithRetryReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const reset = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  }, []);

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      setIsLoading(true);
      setHasError(false);
      onRetry?.(retryCount + 1);
    }
  }, [retryCount, maxRetries, onRetry]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);

    if (retryCount < maxRetries - 1) {
      setTimeout(() => {
        retry();
      }, retryDelay);
    } else {
      setHasError(true);
    }
  }, [retryCount, maxRetries, retryDelay, retry]);

  return {
    isLoading,
    hasError,
    retryCount,
    handleLoad,
    handleError,
    retry,
    reset,
  };
}
