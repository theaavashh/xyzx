export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  isNew: boolean;
  badge: string;
}

export interface ProductsResponse {
  success: boolean;
  data?: {
    products?: Product[];
  };
}
