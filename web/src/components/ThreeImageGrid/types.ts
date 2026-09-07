export interface ThreeImageGridItem {
  id: string;
  src: string;
  alt: string;
  link?: string;
}

export interface ThreeImageGridProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  link: string;
}

export interface ThreeImageGridColumn {
  image: ThreeImageGridItem;
  product?: ThreeImageGridProduct;
}

export interface ThreeImageGridData {
  id: string;
  columns: ThreeImageGridColumn[];
  isActive: boolean;
  order: number;
}
