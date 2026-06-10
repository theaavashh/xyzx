export interface Banner {
  id: string;
  image: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  isActive?: boolean;
  order?: number;
}
