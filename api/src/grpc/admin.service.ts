import type { handleUnaryCall } from '@grpc/grpc-js';
import { logger } from '../utils/logger';
import { prisma } from '../lib/database';

function ok(data: any, msg = 'OK') {
  return { success: true, message: msg, data: data || null, error: null };
}
function listOk(data: any[], pagination?: any) {
  return { success: true, message: 'OK', data: data || [], pagination: pagination || null, error: null };
}
function err(msg: string, code = 'INTERNAL') {
  return { success: false, message: msg, data: null, error: { message: msg, code, details: {} } };
}
function listErr(msg: string) {
  return { success: false, message: msg, data: [], pagination: null, error: { message: msg, code: 'INTERNAL', details: {} } };
}
function apiOk(msg: string) {
  return { success: true, message: msg, error: null };
}

const repos: Record<string, any> = {};
async function getRepo(name: string) {
  if (!repos[name]) repos[name] = await import(`../repositories/${name}.repository`);
  return repos[name];
}

function make(name: string, fns: Record<string, (c: any, r: any) => Promise<any>>) {
  const h: Record<string, handleUnaryCall<any, any>> = {};
  for (const [k, fn] of Object.entries(fns)) {
    h[k] = async (call, cb) => {
      try { cb(null, await fn(call, await getRepo(name).catch(() => ({ prisma })))); }
      catch (e) { logger.error(`gRPC ${name}.${k} error`, undefined, e as Error); cb(null, err('Internal error')); }
    };
  }
  return h;
}

function lp(c: any, r: any, fn: string) {
  const { page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = c.request;
  const f: any = {};
  if (search) f.search = search;
  return r[fn](page, limit, f, { sortBy, sortOrder: sortOrder as 'asc' | 'desc' }).then((res: any) =>
    listOk(res.data, { page, limit, total: res.pagination.total, totalPages: res.pagination.pages })
  );
}
function gi(c: any, r: any, fn: string) {
  if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
  return r[fn](c.request.id).then((d: any) => d ? ok(d) : err('Not found', 'NOT_FOUND'));
}

export const staffHandlers = make('staff', {
  GetStaff: (c, r) => lp(c, r, 'findStaff'),
  GetStaffById: (c, r) => gi(c, r, 'findStaffById'),
  CreateStaff: (c, r) => r.createStaff(c.request).then((d: any) => ok(d, 'Created')),
  UpdateStaff: (c, r) => {
    const { id, ...data } = c.request;
    if (!id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.updateStaff(id, data).then((d: any) => ok(d, 'Updated'));
  },
  DeleteStaff: (c, r) => {
    if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.deleteStaff(c.request.id).then(() => apiOk('Deleted'));
  },
  ToggleStaffStatus: (c, r) => r.toggleStaffStatus(c.request.id).then((d: any) => ok(d, 'Toggled')),
  UpdateStaffPermissions: (c, r) => {
    const { id, permissions } = c.request;
    if (!id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.updateStaffPermissions(id, permissions).then((d: any) => ok(d, 'Updated'));
  },
});

export const analyticsHandlers = make('analytics', {
  GetRecentActivity: async (_c, r) => {
    const data = await (r.getRecentActivity?.() ?? []);
    return ok(JSON.stringify(data));
  },
  GetRecentOrders: async (_c, r) => {
    const data = await (r.getRecentOrders?.() ?? []);
    return ok(JSON.stringify(data));
  },
  GetSalesOverview: (c, _r) => prisma.order.findMany({ take: 100, orderBy: { createdAt: 'desc' } }).then((d: any) => ok(JSON.stringify(d))),
  GetOrdersChart: (c, _r) => prisma.order.findMany({ take: 100, orderBy: { createdAt: 'desc' } }).then((d: any) => ok(JSON.stringify(d))),
  GetTrafficOverview: async (_c, _r) => ok(JSON.stringify({})),
  GetTopProducts: async (c, _r) => {
    const limit = Math.min(Math.max(parseInt(c.request.limit) || 10, 1), 100);
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });
    const productIds = orderItems.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p.name]));
    const data = orderItems.map((i) => ({
      id: i.productId,
      name: productMap.get(i.productId) || 'Unknown',
      total_sold: i._sum.quantity || 0,
    }));
    return ok(JSON.stringify(data));
  },
  GetRevenueMetrics: (c, _r) => prisma.order.findMany({ take: 100, orderBy: { createdAt: 'desc' } }).then((d: any) => ok(JSON.stringify(d))),
  GetOrdersByStatus: async (_c, _r) => {
    const data = await prisma.order.groupBy({ by: ['status'], _count: { id: true } });
    return ok(JSON.stringify(data));
  },
  GetCategoryPerformance: async (_c, _r) => {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { products: true } },
      },
    });
    const data = categories.map((c) => ({
      id: c.id,
      name: c.name,
      product_count: c._count.products,
    }));
    return ok(JSON.stringify(data));
  },
});

export const settingsHandlers = make('settings', {
  GetSettings: async (_c, r) => {
    const data = await r.getAllSettings?.() ?? {};
    return ok(JSON.stringify(data));
  },
  UpdateSettings: async (c, r) => {
    const data = await r.updateSettings(c.request);
    return ok(JSON.stringify(data), 'Updated');
  },
  ResetSettings: async (_c, r) => {
    await r.resetSettings?.();
    return apiOk('Reset');
  },
});

export const colorThemeHandlers = make('color-theme', {
  GetColorSettings: async (_c, r) => {
    const data = await r.getColorSettings?.() ?? {};
    return ok(data);
  },
  UpdateColorSettings: async (c, r) => {
    const data = await (r.upsertColorSettings?.(c.request) ?? r.updateColorSettings?.(c.request));
    return ok(data, 'Updated');
  },
});

export const seoHandlers = make('seo', {
  GetSitemap: async (_c, r) => {
    const data = await r.getSitemap?.() ?? { urls: [] };
    return ok(JSON.stringify(data));
  },
  UpdateSitemap: async (c, r) => {
    await (r.updateSitemap?.(c.request) ?? Promise.resolve());
    return apiOk('Updated');
  },
  AddSitemapUrl: async (c, r) => {
    await (r.addSitemapUrl?.(c.request) ?? Promise.resolve());
    return apiOk('Added');
  },
  DeleteSitemapUrl: async (c, r) => {
    await (r.deleteSitemapUrl?.(c.request.loc) ?? Promise.resolve());
    return apiOk('Deleted');
  },
  GenerateSitemap: async (_c, r) => {
    await (r.generateSitemap?.() ?? Promise.resolve());
    return apiOk('Generated');
  },
  GetRobots: async (_c, r) => {
    const data = await r.getRobots?.() ?? { content: '' };
    return ok(JSON.stringify(data));
  },
  UpdateRobots: async (c, r) => {
    await (r.updateRobots?.(c.request) ?? Promise.resolve());
    return apiOk('Updated');
  },
});

export const jsonLdHandlers = make('json-ld', {
  GetJsonLdTemplates: (c, r) => {
    const { type, page, isActive } = c.request;
    const filters: any = {};
    if (type) filters.type = type;
    if (page) filters.page = page;
    if (isActive !== undefined) filters.isActive = isActive;
    return r.findTemplates(filters).then((d: any) => listOk(d));
  },
  GetJsonLdTemplateById: (c, r) => gi(c, r, 'findTemplateById'),
  GetJsonLdForPage: async (c, r) => {
    const data = await r.getTemplatesForPage(c.request.page, c.request.variables);
    return listOk(data);
  },
  CreateJsonLdTemplate: (c, r) => r.createTemplate(c.request).then((d: any) => ok(d, 'Created')),
  UpdateJsonLdTemplate: (c, r) => {
    const { id, ...data } = c.request;
    if (!id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.updateTemplate(id, data).then((d: any) => ok(d, 'Updated'));
  },
  DeleteJsonLdTemplate: (c, r) => {
    if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.deleteTemplate(c.request.id).then(() => apiOk('Deleted'));
  },
  BulkDeleteJsonLdTemplates: (c, r) => {
    if (!c.request.ids?.length) return Promise.resolve(err('IDs required', 'INVALID'));
    return r.bulkDeleteTemplates(c.request.ids).then(() => apiOk('Deleted'));
  },
  GetAvailableTypes: async (_c, r) => {
    const types = await (r.getAvailableTypes?.() ?? []);
    return { success: true, message: 'OK', data: types, error: null };
  },
  GetAvailablePages: async (_c, r) => {
    const pages = await (r.getAvailablePages?.() ?? []);
    return { success: true, message: 'OK', data: pages, error: null };
  },
});
