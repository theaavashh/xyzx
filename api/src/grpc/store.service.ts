import type { handleUnaryCall } from '@grpc/grpc-js';
import { logger } from '../utils/logger';

const repos: Record<string, any> = {};

async function getRepo(name: string) {
  if (!repos[name]) repos[name] = await import(`../repositories/${name}.repository`);
  return repos[name];
}

function ok(data: any, msg = 'OK') {
  return { success: true, message: msg, data: data || null, error: null };
}
function listOk(data: any[], pagination?: any) {
  return { success: true, message: 'OK', data: data || [], pagination: pagination || null, error: null };
}
function err(msg: string, code = 'INTERNAL') {
  return { success: false, message: msg, data: null, error: { message: msg, code, details: {} } };
}
function apiOk(msg: string) {
  return { success: true, message: msg, error: null };
}

function make(name: string, fns: Record<string, (c: any, r: any) => Promise<any>>) {
  const h: Record<string, handleUnaryCall<any, any>> = {};
  for (const [k, fn] of Object.entries(fns)) {
    h[k] = async (call, cb) => {
      try { cb(null, await fn(call, await getRepo(name))); }
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
function ui(c: any, r: any, fn: string) {
  const { id, ...data } = c.request;
  if (!id) return Promise.resolve(err('ID required', 'INVALID'));
  return r[fn](id, data).then((d: any) => ok(d, 'Updated'));
}
function di(c: any, r: any, fn: string) {
  if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
  return r[fn](c.request.id).then(() => apiOk('Deleted'));
}

export const categoryHandlers = make('category', {
  GetCategories: (c, r) => lp(c, r, 'findCategories'),
  GetCategoriesHierarchy: (_c, r) => r.findCategoriesHierarchy().then((d: any) => listOk(d)),
  GetCategoryById: (c, r) => gi(c, r, 'findCategoryById'),
  GetCategoryBySlug: (c, r) => {
    if (!c.request.slug) return Promise.resolve(err('Slug required', 'INVALID'));
    return r.findCategoryBySlug(c.request.slug).then((d: any) => d ? ok(d) : err('Not found', 'NOT_FOUND'));
  },
  CreateCategory: (c, r) => r.createCategory(c.request).then((d: any) => ok(d, 'Created')),
  UpdateCategory: (c, r) => ui(c, r, 'updateCategory'),
  DeleteCategory: (c, r) => di(c, r, 'deleteCategory'),
  ToggleCategoryStatus: (c, r) => r.toggleCategoryStatus(c.request.id).then((d: any) => ok(d, 'Toggled')),
});

export const cartHandlers = make('cart', {
  GetCart: async (c, r) => {
    const { sessionId, userId } = c.request;
    const cart = await r.findCart(sessionId, userId);
    return ok(cart || { id: '', sessionId, userId, items: [], total: 0, createdAt: '', updatedAt: '' });
  },
  AddToCart: async (c, r) => {
    const { sessionId, userId, productId, quantity, size, color } = c.request;
    const cart = await r.addItem(sessionId, userId, productId, quantity, size, color);
    return ok(cart);
  },
  UpdateCartItem: async (c, r) => {
    const { itemId, quantity, sessionId, userId } = c.request;
    const cart = await r.updateItemQuantity(sessionId, userId, itemId, quantity);
    return ok(cart);
  },
  RemoveCartItem: async (c, r) => {
    const { itemId, sessionId, userId } = c.request;
    const cart = await r.removeItem(sessionId, userId, itemId);
    return ok(cart);
  },
  ClearCart: async (c, r) => {
    const { sessionId, userId } = c.request;
    await r.clearCart(sessionId, userId);
    return ok(null, 'Cleared');
  },
});

export const navigationHandlers = make('navigation', {
  GetNavigationItems: (_c, r) => r.findActive().then((d: any) => listOk(d)),
  GetAllNavigationItems: (_c, r) => r.findAll().then((d: any) => listOk(d)),
  GetNavigationItemById: (c, r) => gi(c, r, 'findById'),
  CreateNavigationItem: (c, r) => r.create(c.request).then((d: any) => ok(d, 'Created')),
  UpdateNavigationItem: (c, r) => ui(c, r, 'update'),
  DeleteNavigationItem: (c, r) => di(c, r, 'delete'),
  ToggleNavigationItemStatus: (c, r) => r.toggleStatus(c.request.id).then((d: any) => ok(d, 'Toggled')),
  ReorderNavigationItems: (c, r) => r.reorder(c.request.orders).then(() => apiOk('Reordered')),
});

export const footerCatalogHandlers = make('footer-catalog', {
  GetFooterCatalogs: (_c, r) => r.findActive().then((d: any) => listOk(d)),
  GetAllFooterCatalogs: (_c, r) => r.findAll().then((d: any) => listOk(d)),
  GetFooterCatalogById: (c, r) => gi(c, r, 'findById'),
  CreateFooterCatalog: (c, r) => r.create(c.request).then((d: any) => ok(d, 'Created')),
  UpdateFooterCatalog: (c, r) => ui(c, r, 'update'),
  DeleteFooterCatalog: (c, r) => di(c, r, 'delete'),
  ToggleFooterCatalogStatus: (c, r) => r.toggleStatus(c.request.id).then((d: any) => ok(d, 'Toggled')),
  ReorderFooterCatalogs: (c, r) => r.reorder(c.request.orders).then(() => apiOk('Reordered')),
});

export const footerSectionHandlers = make('footer-section', {
  GetFooterSections: (_c, r) => r.findActive().then((d: any) => listOk(d)),
  GetAllFooterSections: (_c, r) => r.findAll().then((d: any) => listOk(d)),
  GetFooterSectionById: (c, r) => gi(c, r, 'findById'),
  CreateFooterSection: (c, r) => r.create(c.request).then((d: any) => ok(d, 'Created')),
  UpdateFooterSection: (c, r) => ui(c, r, 'update'),
  DeleteFooterSection: (c, r) => di(c, r, 'delete'),
  ToggleFooterSectionStatus: (c, r) => r.toggleStatus(c.request.id).then((d: any) => ok(d, 'Toggled')),
  ReorderFooterSections: (c, r) => r.reorder(c.request.orders).then(() => apiOk('Reordered')),
});

export const storeHandlers = make('store', {
  GetPublicStore: (_c, r) => r.findFirst().then((d: any) => ok(d)),
  GetStore: (_c, r) => r.findFirst().then((d: any) => ok(d)),
  UpdateStore: (c, r) => r.upsert(c.request).then((d: any) => ok(d, 'Updated')),
  ToggleStoreStatus: (_c, r) => r.toggleStatus().then((d: any) => ok(d, 'Toggled')),
});
