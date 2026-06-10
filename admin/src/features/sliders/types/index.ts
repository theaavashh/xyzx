export interface SliderImage {
  id: string;
  imageUrl: string;
  internalLink: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SliderFormData {
  imageUrl: string;
  internalLink: string;
  isActive: boolean;
}
