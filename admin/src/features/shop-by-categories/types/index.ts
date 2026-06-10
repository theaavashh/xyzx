export interface ShopByCategory {
  id: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShopByCategoryForm {
  title: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
}
