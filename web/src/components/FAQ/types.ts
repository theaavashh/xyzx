export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface FAQCategory {
  category: string;
  questions: FAQItem[];
}

export interface FAQResponse {
  success: boolean;
  data?: FAQItem[];
}
