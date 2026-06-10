export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  images: string[];
  isNew: boolean;
  badge: string;
  colors: number;
  description: string;
  sizes: string[];
  colorOptions: string[];
  specifications?: {
    [key: string]: string;
  };
  features?: string[];
  material?: string;
  care?: string;
  origin?: string;
  sku?: string;
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: 'Phoenix Fleece',
    category: "Women's Oversized Cropped Hoodie",
    price: 80,
    originalPrice: 80,
    rating: 4.8,
    reviews: 124,
    images: [
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/d708e04e-cfc3-4523-8f49-0d33ee2d6d38/W+NSW+PHNX+FLC+OS+CRP+HNLY+HDY.png',
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/9557281a-3b6a-46cd-aafc-d2138daf6e0d/W+NSW+PHNX+FLC+OS+LONG+CREW.png',
    ],
    isNew: true,
    badge: 'Best Seller',
    colors: 6,
    description: 'Oversized cropped hoodie with soft fleece',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colorOptions: [
      '#000000',
      '#FFFFFF',
      '#808080',
      '#FFC0CB',
      '#87CEEB',
      '#98FB98',
    ],
    specifications: {
      Material: '80% Cotton, 20% Polyester',
      Fit: 'Oversized',
      Length: 'Cropped',
      'Pocket Style': 'Kangaroo',
      'Hood Style': 'Adjustable',
      'Cuff Style': 'Ribbed',
      'Hem Style': 'Ribbed',
    },
    features: [
      'Soft fleece interior for maximum comfort',
      'Adjustable hood with drawcord',
      'Kangaroo pocket for storage',
      'Ribbed cuffs and hem for secure fit',
      'Oversized silhouette for modern look',
    ],
    material: 'Premium cotton blend fleece',
    care: 'Machine wash cold, tumble dry low',
    origin: 'Imported',
    sku: 'PHNX-FLC-001',
  },
  {
    id: 2,
    name: 'Sportswear Club Fleece',
    category: "Women's Pullover Hoodie",
    price: 70,
    originalPrice: 70,
    rating: 4.9,
    reviews: 89,
    images: [
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/9ecb84fd-be13-4f3c-8e11-644fdc83e381/W+NSW+CLUB+FLC+STD+PO+HDY.png',
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/f44e125f-7bd3-438b-a3ae-1edf1bed7420/W+NSW+CLUB+FLC+VNECK+CREW.png',
    ],
    isNew: true,
    badge: 'Best Seller',
    colors: 14,
    description: 'Classic pullover hoodie with standard fit',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colorOptions: [
      '#000000',
      '#FFFFFF',
      '#808080',
      '#FFC0CB',
      '#87CEEB',
      '#98FB98',
      '#FFB6C1',
      '#DDA0DD',
      '#F0E68C',
      '#E6E6FA',
      '#FFE4B5',
      '#FFDAB9',
      '#FFE4E1',
      '#F5DEB3',
    ],
  },
  {
    id: 3,
    name: 'Sportswear Phoenix Fleece',
    category: "Women's Over-Oversized Hoodie",
    price: 80,
    originalPrice: 80,
    rating: 4.7,
    reviews: 156,
    images: [
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/44128971-256c-4184-9b21-dfb3c9219916/W+NSW+PHNX+FLC+OOS+PO+HOODIE.png',
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/5e81f726-c157-4e5c-9e55-b7112619e7d7/W+NSW+PHNX+FLC+OOS+CREW.png',
    ],
    isNew: true,
    badge: 'New',
    colors: 16,
    description: 'Over-oversized pullover hoodie for extra room',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colorOptions: [
      '#000000',
      '#FFFFFF',
      '#808080',
      '#FFC0CB',
      '#87CEEB',
      '#98FB98',
      '#FFB6C1',
      '#DDA0DD',
      '#F0E68C',
      '#E6E6FA',
      '#FFE4B5',
      '#FFDAB9',
      '#FFE4E1',
      '#F5DEB3',
      '#FAFAD2',
      '#F0F8FF',
    ],
  },
  {
    id: 4,
    name: 'Sportswear Tech Fleece',
    category: "Women's Full-Zip Hoodie",
    price: 85,
    originalPrice: 135,
    rating: 4.6,
    reviews: 203,
    images: [
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/b1aa2bbc-9723-4607-8951-3f48b64e1d3c/W+NSW+TCH+FLC+WR+FZ+HDY.png',
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/3ab24b9e-5fc2-4b0e-acf9-574d17d05c20/W+NSW+TCH+FLC+HDY.png',
    ],
    isNew: false,
    badge: 'Sale',
    colors: 7,
    description: 'Full-zip hoodie with modern Tech Fleece fabric',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colorOptions: [
      '#000000',
      '#FFFFFF',
      '#808080',
      '#FFC0CB',
      '#87CEEB',
      '#98FB98',
      '#FFB6C1',
    ],
  },
  {
    id: 5,
    name: 'Sportswear Phoenix Fleece',
    category: "Women's 1/4-Zip Sweatshirt",
    price: 80,
    originalPrice: 80,
    rating: 4.8,
    reviews: 67,
    images: [
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/d63253c3-5a72-427e-97de-9f8bcaaafc5c/W+NSW+PHNX+FLC+OS+LONG+QZ.png',
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/9557281a-3b6a-46cd-aafc-d2138daf6e0d/W+NSW+PHNX+FLC+OS+LONG+CREW.png',
    ],
    isNew: true,
    badge: 'Best Seller',
    colors: 13,
    description: 'Oversized 1/4-zip long sweatshirt',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colorOptions: [
      '#000000',
      '#FFFFFF',
      '#808080',
      '#FFC0CB',
      '#87CEEB',
      '#98FB98',
      '#FFB6C1',
      '#DDA0DD',
      '#F0E68C',
      '#E6E6FA',
      '#FFE4B5',
      '#FFDAB9',
      '#FFE4E1',
    ],
  },
  {
    id: 6,
    name: 'Nike Pro',
    category: "Women's Therma-FIT Hoodie",
    price: 68,
    originalPrice: 90,
    rating: 4.5,
    reviews: 298,
    images: [
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/7cc0ca7a-3a0c-4c0c-81cc-36a83ee08c45/W+NP+TF+FLC+HOODIE+GG+GRX.png',
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/b5ac81d3-42d1-4009-bcea-06b6f59f497b/W+NK+ONE+TF+HZ+TOP+POLAR+SP.png',
    ],
    isNew: false,
    badge: 'Sale',
    colors: 4,
    description: 'Therma-FIT fleece hoodie for warmth',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colorOptions: ['#000000', '#FFFFFF', '#808080', '#FFC0CB'],
  },
  {
    id: 7,
    name: 'Sportswear Chill Knit',
    category: "Women's Lightweight Hoodie",
    price: 65,
    originalPrice: 65,
    rating: 4.7,
    reviews: 145,
    images: [
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/9df8c438-b8da-4806-9ded-05045288f5d9/W+NSW+CHILL+KNIT+LTWT+OS+HOODY.png',
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/747b48aa-e06b-44ee-8911-4e5d39a40f77/W+NK+24.7+DF+HZ+TOP+SOFT+KNIT.png',
    ],
    isNew: true,
    badge: 'Sustainable',
    colors: 3,
    description: 'Lightweight hoodie made with recycled materials',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colorOptions: ['#000000', '#FFFFFF', '#808080'],
  },
  {
    id: 8,
    name: 'Jordan Flight Fleece',
    category: "Women's Quarter-Zip Top",
    price: 66,
    originalPrice: 88,
    rating: 4.6,
    reviews: 178,
    images: [
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5e2e0b3c-3a7b-4858-947a-e2d333cf6da5/W+J+FLT+FLC+QZ+SSNL.png',
      'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/9496601d-5d66-4281-9b5a-e3db096ae47f/W+NK+UNVRSA+DF+HZ+TOP+FLC.png',
    ],
    isNew: false,
    badge: 'Sale',
    colors: 3,
    description: 'Jordan Flight Fleece quarter-zip top',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colorOptions: ['#000000', '#FFFFFF', '#808080'],
  },
];

export function getProductById(id: number): Product | undefined {
  return PRODUCTS_DATA.find((product) => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS_DATA.filter((product) =>
    product.category.toLowerCase().includes(category.toLowerCase()),
  );
}

export function getProductsByBadge(badge: string): Product[] {
  return PRODUCTS_DATA.filter((product) =>
    product.badge.toLowerCase().includes(badge.toLowerCase()),
  );
}
