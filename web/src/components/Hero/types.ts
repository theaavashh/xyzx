export interface Slide {
  image: string;
  imageMobile?: string;
  title: string;
  subtitle: string;
  alt: string;
}

export interface HeroProps {
  slides?: Slide[];
  autoPlayInterval?: number;
}
