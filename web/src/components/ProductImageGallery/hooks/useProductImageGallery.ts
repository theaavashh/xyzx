import { useCallback, useState } from 'react';

interface ImageState {
  isLoading: boolean;
  hasError: boolean;
  retryCount: number;
}

interface UseProductImageGalleryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export function useProductImageGallery({
  maxRetries = 3,
  retryDelay = 1000,
}: UseProductImageGalleryOptions = {}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageStates, setImageStates] = useState<Record<number, ImageState>>(
    {},
  );

  const getImageState = useCallback(
    (index: number): ImageState => {
      return (
        imageStates[index] || {
          isLoading: true,
          hasError: false,
          retryCount: 0,
        }
      );
    },
    [imageStates],
  );

  const handleSelect = useCallback((index: number) => {
    setSelectedImage(index);
    setImageStates((prev) => ({
      ...prev,
      [index]: { isLoading: true, hasError: false, retryCount: 0 },
    }));
  }, []);

  const handleLoad = useCallback((index: number) => {
    setImageStates((prev) => ({
      ...prev,
      [index]: { isLoading: false, hasError: false, retryCount: 0 },
    }));
  }, []);

  const handleError = useCallback(
    (index: number) => {
      const currentState = imageStates[index] || {
        isLoading: false,
        hasError: false,
        retryCount: 0,
      };
      const newRetryCount = currentState.retryCount + 1;

      if (newRetryCount < maxRetries) {
        setTimeout(() => {
          setImageStates((prev) => ({
            ...prev,
            [index]: {
              isLoading: true,
              hasError: false,
              retryCount: newRetryCount,
            },
          }));
        }, retryDelay);
        setImageStates((prev) => ({
          ...prev,
          [index]: {
            isLoading: true,
            hasError: false,
            retryCount: newRetryCount,
          },
        }));
      } else {
        setImageStates((prev) => ({
          ...prev,
          [index]: {
            isLoading: false,
            hasError: true,
            retryCount: newRetryCount,
          },
        }));
      }
    },
    [imageStates, maxRetries, retryDelay],
  );

  const handleRetry = useCallback((index: number) => {
    setImageStates((prev) => ({
      ...prev,
      [index]: { isLoading: true, hasError: false, retryCount: 0 },
    }));
  }, []);

  return {
    selectedImage,
    getImageState,
    handleSelect,
    handleLoad,
    handleError,
    handleRetry,
  };
}
