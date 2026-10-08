export interface NewInVariant {
  color?: string;
  size?: string;
  pattern?: string;
  price?: number;
  comparePrice?: number;
  discountPrice?: number;
  sku?: string;
  quantity?: number;
}

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
  variants?: NewInVariant[];
}
