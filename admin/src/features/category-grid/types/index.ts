export interface CategoryGridItem {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string;
  alt: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryGridForm {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  alt: string;
  isActive: boolean;
  order: number;
}
