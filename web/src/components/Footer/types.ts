export interface FooterLink {
  id: string;
  name: string;
  href: string;
  order: number;
}

export interface FooterSectionData {
  id: string;
  title: string;
  order: number;
  isActive: boolean;
  links: FooterLink[];
}

export interface FooterProps {
  sections: FooterSectionData[];
}
