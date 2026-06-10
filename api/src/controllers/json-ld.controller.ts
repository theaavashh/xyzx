import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import {
  asyncHandler,
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from '../utils';

const VALID_TYPES = [
  'Organization', 'WebSite', 'Product', 'Article', 'BreadcrumbList',
  'Review', 'Offer', 'AggregateRating', 'FAQPage', 'HowTo',
  'LocalBusiness', 'Event', 'Person', 'VideoObject', 'ImageObject',
  'organization', 'website', 'webpage', 'product', 'breadcrumblist',
  'faqpage', 'localbusiness', 'searchbox', 'collectionpage', 'productlist',
];

const VALID_PAGES = [
  'global', 'home', 'product', 'category', 'cart', 'checkout',
  'about', 'contact', 'blog', 'search', '/', '/products',
  '/products/*', '/categories', '/about', '/contact', '/blog',
  '/blog/*', '/cart', '/checkout', 'all',
];

function replaceVariables(schema: unknown, variables: Record<string, unknown>): unknown {
  if (typeof schema === 'string') {
    return schema.replace(/\{\{(\w+)\}\}/g, (_, key) =>
      variables[key] !== undefined ? String(variables[key]) : `{{${key}}}`,
    );
  }
  if (Array.isArray(schema)) {
    return schema.map((item) => replaceVariables(item, variables));
  }
  if (schema && typeof schema === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(schema)) {
      result[key] = replaceVariables(value, variables);
    }
    return result;
  }
  return schema;
}

export const getJsonLdTemplates: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const type = req.query.type as string | undefined;
    const page = req.query.page as string | undefined;
    const isActive = req.query.isActive as string | undefined;

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (page) where.page = page;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const templates = await prisma.jsonLdTemplate.findMany({
      where,
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    });

    sendSuccess(res, templates);
  },
);

export const getJsonLdTemplateById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const template = await prisma.jsonLdTemplate.findUnique({ where: { id } });

    if (!template) {
      sendNotFound(res, 'JSON-LD template not found');
      return;
    }

    sendSuccess(res, template);
  },
);

export const getJsonLdForPage: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.params.page as string;
    const variables = req.query.variables as string | undefined;

    const templates = await prisma.jsonLdTemplate.findMany({
      where: { page: page === 'global' ? 'global' : page, isActive: true },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    });

    const globalTemplates = await prisma.jsonLdTemplate.findMany({
      where: { page: 'global', isActive: true },
      orderBy: { priority: 'asc' },
    });

    const allTemplates = [...templates, ...globalTemplates];
    let schemas: unknown[] = allTemplates.map((t) => t.schema as unknown);

    if (variables && typeof variables === 'string') {
      try {
        const vars = JSON.parse(variables);
        schemas = schemas.map((schema) => replaceVariables(schema, vars));
      } catch {}
    }

    sendSuccess(res, schemas);
  },
);

export const createJsonLdTemplate: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, type, page, schema, variables, isActive, priority } = req.body;

    if (!name || !type || !page || !schema) {
      sendBadRequest(res, 'Name, type, page, and schema are required');
      return;
    }

    if (!VALID_TYPES.includes(type)) {
      sendBadRequest(res, `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`);
      return;
    }

    if (!VALID_PAGES.includes(page)) {
      sendBadRequest(res, `Invalid page. Must be one of: ${VALID_PAGES.join(', ')}`);
      return;
    }

    const template = await prisma.jsonLdTemplate.create({
      data: {
        name, type, page, schema, variables,
        isActive: isActive ?? true,
        priority: priority ?? 0,
      },
    });

    sendCreated(res, template, 'JSON-LD template created successfully');
  },
);

export const updateJsonLdTemplate: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, type, page, schema, variables, isActive, priority } = req.body;

    const existing = await prisma.jsonLdTemplate.findUnique({ where: { id } });
    if (!existing) {
      sendNotFound(res, 'JSON-LD template not found');
      return;
    }

    if (type && !VALID_TYPES.includes(type)) {
      sendBadRequest(res, `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`);
      return;
    }

    if (page && !VALID_PAGES.includes(page)) {
      sendBadRequest(res, `Invalid page. Must be one of: ${VALID_PAGES.join(', ')}`);
      return;
    }

    const template = await prisma.jsonLdTemplate.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(page !== undefined && { page }),
        ...(schema !== undefined && { schema }),
        ...(variables !== undefined && { variables }),
        ...(isActive !== undefined && { isActive }),
        ...(priority !== undefined && { priority }),
      },
    });

    sendSuccess(res, template, 'JSON-LD template updated successfully');
  },
);

export const deleteJsonLdTemplate: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const existing = await prisma.jsonLdTemplate.findUnique({ where: { id } });
    if (!existing) {
      sendNotFound(res, 'JSON-LD template not found');
      return;
    }

    await prisma.jsonLdTemplate.delete({ where: { id } });

    sendSuccess(res, null, 'JSON-LD template deleted successfully');
  },
);

export const bulkDeleteJsonLdTemplates: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      sendBadRequest(res, 'Template IDs are required');
      return;
    }

    await prisma.jsonLdTemplate.deleteMany({ where: { id: { in: ids } } });

    sendSuccess(res, { deletedCount: ids.length }, `${ids.length} templates deleted successfully`);
  },
);

export const getAvailableTypes: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    sendSuccess(res, VALID_TYPES);
  },
);

export const getAvailablePages: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    sendSuccess(res, VALID_PAGES);
  },
);
