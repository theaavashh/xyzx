export interface JsonLdScript {
  id: string;
  name: string;
  type: string;
  page: string;
  schema: Record<string, unknown>;
  variables: Record<string, unknown> | null;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  category?: string;
}

export interface RobotRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
}

export interface SitemapConfig {
  url: string;
  enabled: boolean;
}

