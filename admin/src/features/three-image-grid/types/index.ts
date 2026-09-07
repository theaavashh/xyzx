export interface ThreeImageGridColumnItem {
  id?: string;
  imageSrc: string;
  imageAlt: string;
  imageLink: string;
  productName: string;
  productPrice: string;
  productOriginalPrice: string;
  productImage: string;
  productLink: string;
  order: number;
}

export interface ThreeImageGridSection {
  id: string;
  isActive: boolean;
  order: number;
  columns: {
    id: string;
    imageSrc: string;
    imageAlt: string;
    imageLink: string | null;
    productName: string | null;
    productPrice: number | null;
    productOriginalPrice: number | null;
    productImage: string | null;
    productLink: string | null;
    order: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_COLUMN: ThreeImageGridColumnItem = {
  imageSrc: '',
  imageAlt: '',
  imageLink: '',
  productName: '',
  productPrice: '',
  productOriginalPrice: '',
  productImage: '',
  productLink: '',
  order: 0,
};
