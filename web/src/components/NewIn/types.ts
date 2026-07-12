export interface NewInProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  colors?: { name: string; hex: string }[];
}
