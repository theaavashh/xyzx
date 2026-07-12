export interface ImageGridItem {
  id: string;
  src: string;
  alt: string;
  title: string | null;
  subtitle: string | null;
  link: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImageGridForm {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  link: string;
  isActive: boolean;
  order: number;
}
