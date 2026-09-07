export interface NewInProduct {
  id: number;
  name: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  colors?: { name: string; hex: string }[];
  patterns?: { name: string }[];
  category?: { id: string; name: string; slug: string } | null;
}
