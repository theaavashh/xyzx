export interface CategoryTileGridItem {
  id?: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  order: number;
}

export interface CategoryTileGridSection {
  id: string;
  isActive: boolean;
  order: number;
  items: {
    id: string;
    title: string;
    subtitle: string | null;
    image: string;
    link: string;
    order: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_ITEM: CategoryTileGridItem = {
  title: '',
  subtitle: '',
  image: '',
  link: '',
  order: 0,
};
