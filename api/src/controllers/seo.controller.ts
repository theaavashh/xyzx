import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import { asyncHandler, sendSuccess, sendBadRequest } from '../utils';

// Sitemap
export const getSitemap: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    let config = await prisma.sitemapConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!config) {
      config = await prisma.sitemapConfig.create({
        data: { urls: JSON.stringify([]) },
      });
    }

    const urls = typeof config.urls === 'string' ? JSON.parse(config.urls) : config.urls;

    const categories: string[] = [];
    for (const url of urls) {
      if (url.category && !categories.includes(url.category)) {
        categories.push(url.category);
      }
    }

    sendSuccess(res, {
      urls,
      totalUrls: urls.length,
      lastModified: config.updatedAt.toISOString(),
      categories,
    });
  },
);

export const updateSitemap: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { urls } = req.body;
    if (!Array.isArray(urls)) {
      return sendBadRequest(res, 'urls must be an array');
    }

    let config = await prisma.sitemapConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (config) {
      config = await prisma.sitemapConfig.update({
        where: { id: config.id },
        data: { urls: JSON.stringify(urls) },
      });
    } else {
      config = await prisma.sitemapConfig.create({
        data: { urls: JSON.stringify(urls) },
      });
    }

    const parsedUrls = typeof config.urls === 'string' ? JSON.parse(config.urls) : config.urls;

    sendSuccess(res, {
      urls: parsedUrls,
      totalUrls: parsedUrls.length,
      lastModified: config.updatedAt.toISOString(),
    });
  },
);

export const addSitemapUrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const url = req.body;
    if (!url.loc) {
      return sendBadRequest(res, 'loc is required');
    }

    let config = await prisma.sitemapConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const existingUrls = config && config.urls
      ? (typeof config.urls === 'string' ? JSON.parse(config.urls) : config.urls)
      : [];

    existingUrls.push(url);

    if (config) {
      config = await prisma.sitemapConfig.update({
        where: { id: config.id },
        data: { urls: JSON.stringify(existingUrls) },
      });
    } else {
      config = await prisma.sitemapConfig.create({
        data: { urls: JSON.stringify(existingUrls) },
      });
    }

    sendSuccess(res, { success: true });
  },
);

export const deleteSitemapUrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { loc } = req.query;
    if (!loc) {
      return sendBadRequest(res, 'loc query parameter is required');
    }

    let config = await prisma.sitemapConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!config) {
      return sendSuccess(res, { success: true });
    }

    const existingUrls = typeof config.urls === 'string' ? JSON.parse(config.urls) : config.urls;
    const filteredUrls = existingUrls.filter((u: { loc: string }) => u.loc !== loc);

    config = await prisma.sitemapConfig.update({
      where: { id: config.id },
      data: { urls: JSON.stringify(filteredUrls) },
    });

    sendSuccess(res, { success: true });
  },
);

export const generateSitemap: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const defaultUrls = [
      { loc: 'https://rapharch.com/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '1.0', category: 'Homepage' },
      { loc: 'https://rapharch.com/products', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '0.9', category: 'Products' },
      { loc: 'https://rapharch.com/categories', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '0.8', category: 'Category' },
      { loc: 'https://rapharch.com/auth/login', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.5', category: 'Auth' },
      { loc: 'https://rapharch.com/auth/register', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.5', category: 'Auth' },
      { loc: 'https://rapharch.com/cart', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.7', category: 'Shopping' },
      { loc: 'https://rapharch.com/checkout', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.7', category: 'Shopping' },
      { loc: 'https://rapharch.com/privacy-policy', lastmod: new Date().toISOString().split('T')[0], changefreq: 'quarterly', priority: '0.5', category: 'Legal' },
      { loc: 'https://rapharch.com/terms-of-use', lastmod: new Date().toISOString().split('T')[0], changefreq: 'quarterly', priority: '0.5', category: 'Legal' },
      { loc: 'https://rapharch.com/refund', lastmod: new Date().toISOString().split('T')[0], changefreq: 'quarterly', priority: '0.5', category: 'Legal' },
      { loc: 'https://rapharch.com/contact-us', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.5', category: 'Legal' },
      { loc: 'https://rapharch.com/rewards', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '0.6', category: 'Rewards' },
    ];

    let config = await prisma.sitemapConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (config) {
      config = await prisma.sitemapConfig.update({
        where: { id: config.id },
        data: { urls: JSON.stringify(defaultUrls) },
      });
    } else {
      config = await prisma.sitemapConfig.create({
        data: { urls: JSON.stringify(defaultUrls) },
      });
    }

    const categories: string[] = [];
    for (const url of defaultUrls) {
      if (url.category && !categories.includes(url.category)) {
        categories.push(url.category);
      }
    }

    sendSuccess(res, {
      urls: defaultUrls,
      totalUrls: defaultUrls.length,
      lastModified: config.updatedAt.toISOString(),
      categories,
    });
  },
);

// Robots.txt
export const getRobots: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    let config = await prisma.robotsConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!config) {
      config = await prisma.robotsConfig.create({
        data: {
          content: `User-agent: *\nAllow: /\n\n# Sitemap\nSitemap: https://rapharch.com/sitemap.xml`,
        },
      });
    }

    res.set('Content-Type', 'text/plain');
    sendSuccess(res, { content: config.content });
  },
);

export const updateRobots: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const content = typeof req.body === 'string' ? req.body : req.body.content;
    if (!content) {
      return sendBadRequest(res, 'content is required');
    }

    let config = await prisma.robotsConfig.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (config) {
      config = await prisma.robotsConfig.update({
        where: { id: config.id },
        data: { content },
      });
    } else {
      config = await prisma.robotsConfig.create({
        data: { content },
      });
    }

    sendSuccess(res, { content: config.content });
  },
);

// JSON-LD
export const getJsonLdTemplates: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const templates = await prisma.jsonLdTemplate.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    const scripts = templates.map((t) => ({
      id: t.id,
      name: t.name,
      type: t.type,
      content: JSON.stringify(t.schema, null, 2),
      pages: t.page === 'global' ? ['all'] : [t.page],
      enabled: t.isActive,
    }));

    sendSuccess(res, scripts);
  },
);

export const updateJsonLdTemplates: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const scripts = req.body;
    if (!Array.isArray(scripts)) {
      return sendBadRequest(res, 'body must be an array of scripts');
    }

    await prisma.jsonLdTemplate.deleteMany({});

    for (const script of scripts) {
      let schema;
      try {
        schema = typeof script.content === 'string' ? JSON.parse(script.content) : script.content;
      } catch {
        schema = {};
      }

      const page = script.pages?.includes('all') ? 'global' : (script.pages?.[0] || 'global');

      await prisma.jsonLdTemplate.create({
        data: {
          name: script.name || 'Untitled',
          type: script.type || 'Organization',
          page,
          schema,
          isActive: script.enabled !== false,
          priority: 0,
        },
      });
    }

    sendSuccess(res, { success: true });
  },
);
