import toast from 'react-hot-toast';
import { getErrorMessage } from '@/types';

interface HandleAsyncErrorOptions {
  message?: string;
  showToast?: boolean;
  onError?: (error: Error) => void;
}

export async function handleAsyncError<T>(
  fn: () => Promise<T>,
  options: HandleAsyncErrorOptions = {},
): Promise<T | null> {
  const { message = 'An error occurred', showToast = true, onError } = options;

  try {
    return await fn();
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    if (showToast) {
      toast.error(message);
    }

    onError?.(error instanceof Error ? error : new Error(errorMessage));

    return null;
  }
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes('401') ||
      msg.includes('unauthorized') ||
      msg.includes('session expired') ||
      msg.includes('access token')
    );
  }
  return false;
}
