export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface ProductColorImages {
  [color: string]: ProductImage[];
}

export interface ImageError {
  index: number;
  retryCount: number;
}

export interface ImageState {
  [index: number]: {
    isLoading: boolean;
    hasError: boolean;
    retryCount: number;
  };
}
