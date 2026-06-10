export interface DualCard {
  id: string;
  src: string;
  alt: string;
  label: string;
  link: string;
  buttonText?: string;
}

export interface DualCardSection {
  id: string;
  cards: DualCard[];
  isActive: boolean;
  order: number;
}

export interface DualCardSectionResponse {
  success: boolean;
  data?: DualCardSection[];
}
