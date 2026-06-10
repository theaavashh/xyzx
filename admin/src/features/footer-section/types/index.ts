export interface FooterSectionLink {
  id?: string;
  name: string;
  href: string;
  order: number;
}

export interface FooterSection {
  id: string;
  title: string;
  order: number;
  isActive: boolean;
  links: FooterSectionLink[];
  createdAt: string;
  updatedAt: string;
}

export interface FooterSectionLinkFormData {
  name: string;
  href: string;
  order: number;
}
