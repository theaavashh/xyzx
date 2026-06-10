export interface Category {
  id: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
}

export interface CategoryResponse {
  success: boolean;
  data?: Category[];
}

export interface CategoryItemProps {
  category: Category;
  index: number;
  priority?: boolean;
}
