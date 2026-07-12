export interface NavLink {
  label: string;
  href: string;
}

export interface NavColumn {
  id: string;
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

export interface NavItemsResponse {
  success: boolean;
  data?: NavItem[];
}
