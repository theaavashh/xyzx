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
  createdAt: string;
  updatedAt: string;
}

export interface DualCardFormState {
  cards: DualCard[];
  isActive: boolean;
}

let cardCounter = 0;

export function createCard(): DualCard {
  cardCounter++;
  return {
    id: `card-${cardCounter}`,
    src: '',
    alt: '',
    label: '',
    link: '/',
    buttonText: 'Explore Now',
  };
}
