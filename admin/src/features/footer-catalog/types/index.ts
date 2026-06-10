export interface FooterCatalogLink {
  id?: string;
  label: string;
  href: string;
  order: number;
}

export interface FooterCatalog {
  id: string;
  title: string;
  href: string;
  order: number;
  isActive: boolean;
  links: FooterCatalogLink[];
  createdAt: string;
  updatedAt: string;
}

export interface FooterCatalogForm {
  title: string;
  href: string;
  order: number;
  isActive: boolean;
  links: FooterCatalogLink[];
}
