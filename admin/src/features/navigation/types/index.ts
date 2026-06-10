export interface NavLink {
  id?: string;
  label: string;
  href: string;
  order: number;
}

export interface NavColumn {
  id?: string;
  title: string;
  href: string;
  order: number;
  links: NavLink[];
}

export interface NavItem {
  id: string;
  name: string;
  href: string;
  order: number;
  isActive: boolean;
  columns: NavColumn[];
}

export interface NavigationFormData {
  name: string;
  href: string;
  order: number;
  isActive: boolean;
  columns: NavColumn[];
}
