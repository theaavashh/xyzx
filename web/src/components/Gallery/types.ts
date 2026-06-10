export interface GalleryItem {
  id: number;
  image: string;
  title: string;
  link: string;
  linkText: string;
  description?: string;
  isActive?: boolean;
  order?: number;
}

export interface GalleryItemResponse {
  success: boolean;
  data?: GalleryItem[];
}
