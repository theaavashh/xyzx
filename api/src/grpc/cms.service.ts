import type { handleUnaryCall } from '@grpc/grpc-js';
import { logger } from '../utils/logger';

const repos: Record<string, any> = {};

async function getRepo(name: string) {
  if (!repos[name]) {
    repos[name] = await import(`../repositories/${name}.repository`);
  }
  return repos[name];
}

function ok(data: any, msg = 'OK') {
  return { success: true, message: msg, data: data || null, error: null };
}

function listOk(data: any[], pagination: any) {
  return { success: true, message: 'OK', data: data || [], pagination: pagination || null, error: null };
}

function err(msg: string, code = 'INTERNAL') {
  return { success: false, message: msg, data: null, error: { message: msg, code, details: {} } };
}

function listErr(msg: string) {
  return { success: false, message: msg, data: [], pagination: null, error: { message: msg, code: 'INTERNAL', details: {} } };
}

function makeHandlers(serviceName: string, methods: Record<string, (call: any, repo: any) => Promise<any>>) {
  const handlers: Record<string, handleUnaryCall<any, any>> = {};
  for (const [method, fn] of Object.entries(methods)) {
    handlers[method] = async (call, callback) => {
      try {
        const repo = await getRepo(serviceName);
        const result = await fn(call, repo);
        callback(null, result);
      } catch (error) {
        logger.error(`gRPC ${serviceName}.${method} error`, undefined, error as Error);
        callback(null, err('Internal error'));
      }
    };
  }
  return handlers;
}

export const bannerHandlers = makeHandlers('banner', {
  GetBanners: async (call: any, repo: any) => {
    const { page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = call.request;
    const filters: any = {};
    if (search) filters.search = search;
    const r = await repo.findBanners(page, limit, filters, { sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
    return listOk(r.data, { page, limit, total: r.pagination.total, totalPages: r.pagination.pages });
  },
  GetActiveBanners: async (call: any, repo: any) => {
    const r = await repo.findActiveBanners(call.request.position || undefined);
    return listOk(r, null);
  },
  GetBannerById: async (call: any, repo: any) => {
    if (!call.request.id) return err('ID required', 'INVALID');
    const r = await repo.findBannerById(call.request.id);
    if (!r) return err('Not found', 'NOT_FOUND');
    return ok(r);
  },
  CreateBanner: async (call: any, repo: any) => {
    const r = await repo.createBanner(call.request);
    return ok(r, 'Created');
  },
  UpdateBanner: async (call: any, repo: any) => {
    const { id, ...data } = call.request;
    if (!id) return err('ID required', 'INVALID');
    const exists = await repo.existsById?.(id) ?? await repo.findBannerById(id);
    if (!exists) return err('Not found', 'NOT_FOUND');
    const r = await repo.updateBanner(id, data);
    return ok(r, 'Updated');
  },
  DeleteBanner: async (call: any, repo: any) => {
    if (!call.request.id) return err('ID required', 'INVALID');
    await repo.deleteBanner(call.request.id);
    return { success: true, message: 'Deleted', error: null };
  },
  ToggleBannerStatus: async (call: any, repo: any) => {
    if (!call.request.id) return err('ID required', 'INVALID');
    const r = await repo.toggleBannerStatus(call.request.id);
    return ok(r, 'Toggled');
  },
});

export const heroBannerHandlers = makeHandlers('hero-banner', {
  GetHeroBanners: async (call, repo) => (await listPaginated(call, repo, 'findHeroBanners')),
  GetActiveHeroBanners: async (_call, repo) => listOk(await repo.findActiveHeroBanners(), null),
  GetHeroBannerById: async (call, repo) => getById(call, repo, 'findHeroBannerById'),
  CreateHeroBanner: async (call, repo) => ok(await repo.createHeroBanner(call.request), 'Created'),
  UpdateHeroBanner: async (call, repo) => updateById(call, repo, 'updateHeroBanner'),
  DeleteHeroBanner: async (call, repo) => delById(call, repo, 'deleteHeroBanner'),
  ToggleHeroBannerStatus: async (call, repo) => ok(await repo.toggleHeroBannerStatus(call.request.id), 'Toggled'),
  ReorderHeroBanners: async (call, repo) => {
    await repo.reorderHeroBanners(call.request.orders);
    return { success: true, message: 'Reordered', error: null };
  },
});

export const editorialSectionHandlers = makeHandlers('editorial-section', {
  GetEditorialSections: async (call, repo) => listPaginated(call, repo, 'findEditorialSections'),
  GetActiveEditorialSections: async (_call, repo) => listOk(await repo.findActiveEditorialSections(), null),
  GetEditorialSectionById: async (call, repo) => getById(call, repo, 'findEditorialSectionById'),
  CreateEditorialSection: async (call, repo) => ok(await repo.createEditorialSection(call.request), 'Created'),
  UpdateEditorialSection: async (call, repo) => updateById(call, repo, 'updateEditorialSection'),
  DeleteEditorialSection: async (call, repo) => delById(call, repo, 'deleteEditorialSection'),
  ToggleEditorialSectionStatus: async (call, repo) => ok(await repo.toggleEditorialSectionStatus(call.request.id), 'Toggled'),
  ReorderEditorialSections: async (call, repo) => {
    await repo.reorderEditorialSections(call.request.orders);
    return { success: true, message: 'Reordered', error: null };
  },
});

export const dualCardSectionHandlers = makeHandlers('dual-card-section', {
  GetDualCardSections: async (call, repo) => listPaginated(call, repo, 'findDualCardSections'),
  GetActiveDualCardSections: async (_call, repo) => listOk(await repo.findActiveDualCardSections(), null),
  GetDualCardSectionById: async (call, repo) => getById(call, repo, 'findDualCardSectionById'),
  CreateDualCardSection: async (call, repo) => ok(await repo.createDualCardSection(call.request), 'Created'),
  UpdateDualCardSection: async (call, repo) => updateById(call, repo, 'updateDualCardSection'),
  DeleteDualCardSection: async (call, repo) => delById(call, repo, 'deleteDualCardSection'),
  ToggleDualCardSectionStatus: async (call, repo) => ok(await repo.toggleDualCardSectionStatus(call.request.id), 'Toggled'),
  ReorderDualCardSections: async (call, repo) => {
    await repo.reorderDualCardSections(call.request.orders);
    return { success: true, message: 'Reordered', error: null };
  },
});

export const featuredSectionHandlers = makeHandlers('featured-section', {
  GetFeaturedSections: async (call, repo) => listPaginated(call, repo, 'findFeaturedSections'),
  GetActiveFeaturedSections: async (_call, repo) => listOk(await repo.findActiveFeaturedSections(), null),
  GetFeaturedSectionById: async (call, repo) => getById(call, repo, 'findFeaturedSectionById'),
  CreateFeaturedSection: async (call, repo) => ok(await repo.createFeaturedSection(call.request), 'Created'),
  UpdateFeaturedSection: async (call, repo) => updateById(call, repo, 'updateFeaturedSection'),
  DeleteFeaturedSection: async (call, repo) => delById(call, repo, 'deleteFeaturedSection'),
  ToggleFeaturedSectionStatus: async (call, repo) => ok(await repo.toggleFeaturedSectionStatus(call.request.id), 'Toggled'),
  ReorderFeaturedSections: async (call, repo) => {
    await repo.reorderFeaturedSections(call.request.orders);
    return { success: true, message: 'Reordered', error: null };
  },
});

export const followSectionHandlers = makeHandlers('follow-section', {
  GetFollowSection: async (_call, repo) => ok(await repo.findFirstActive() ?? null),
  GetAllFollowSections: async (_call, repo) => listOk(await repo.findAll(), null),
  GetFollowSectionById: async (call, repo) => getById(call, repo, 'findById'),
  CreateFollowSection: async (call, repo) => ok(await repo.create(call.request), 'Created'),
  UpdateFollowSection: async (call, repo) => updateById(call, repo, 'update'),
  DeleteFollowSection: async (call, repo) => delById(call, repo, 'delete'),
  ToggleFollowSectionStatus: async (call, repo) => ok(await repo.toggleStatus(call.request.id), 'Toggled'),
});

export const salesBannerHandlers = makeHandlers('sales-banner', {
  GetSalesBanners: async (call, repo) => listPaginated(call, repo, 'findSalesBanners'),
  GetActiveSalesBanners: async (_call, repo) => listOk(await repo.findActiveSalesBanners(), null),
  GetSalesBannerById: async (call, repo) => getById(call, repo, 'findSalesBannerById'),
  CreateSalesBanner: async (call, repo) => ok(await repo.createSalesBanner(call.request), 'Created'),
  UpdateSalesBanner: async (call, repo) => updateById(call, repo, 'updateSalesBanner'),
  DeleteSalesBanner: async (call, repo) => delById(call, repo, 'deleteSalesBanner'),
  ToggleSalesBannerStatus: async (call, repo) => ok(await repo.toggleSalesBannerStatus(call.request.id), 'Toggled'),
  ReorderSalesBanners: async (call, repo) => {
    await repo.reorderSalesBanners(call.request.orders);
    return { success: true, message: 'Reordered', error: null };
  },
});

export const contentHandlers = makeHandlers('content', {
  GetContentPages: async (call, repo) => listPaginated(call, repo, 'findContentPages'),
  GetContentPageBySlug: async (call, repo) => {
    if (!call.request.slug) return err('Slug required', 'INVALID');
    const r = await repo.findContentPageBySlug(call.request.slug);
    if (!r) return err('Not found', 'NOT_FOUND');
    return ok(r);
  },
  GetContentPageById: async (call, repo) => getById(call, repo, 'findContentPageById'),
  CreateContentPage: async (call, repo) => ok(await repo.createContentPage(call.request), 'Created'),
  UpdateContentPage: async (call, repo) => updateById(call, repo, 'updateContentPage'),
  UpsertContentBySlug: async (call, repo) => ok(await repo.upsertContentBySlug(call.request.slug, call.request), 'Upserted'),
  DeleteContentPage: async (call, repo) => delById(call, repo, 'deleteContentPage'),
  ToggleContentPageStatus: async (call, repo) => ok(await repo.toggleContentPageStatus(call.request.id), 'Toggled'),
});

async function listPaginated(call: any, repo: any, fn: string) {
  const { page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = call.request;
  const filters: any = {};
  if (search) filters.search = search;
  const r = await repo[fn](page, limit, filters, { sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
  return listOk(r.data, { page, limit, total: r.pagination.total, totalPages: r.pagination.pages });
}

async function getById(call: any, repo: any, fn: string) {
  if (!call.request.id) return err('ID required', 'INVALID');
  const r = await repo[fn](call.request.id);
  if (!r) return err('Not found', 'NOT_FOUND');
  return ok(r);
}

async function updateById(call: any, repo: any, fn: string) {
  const { id, ...data } = call.request;
  if (!id) return err('ID required', 'INVALID');
  const r = await repo[fn](id, data);
  return ok(r, 'Updated');
}

async function delById(call: any, repo: any, fn: string) {
  if (!call.request.id) return err('ID required', 'INVALID');
  await repo[fn](call.request.id);
  return { success: true, message: 'Deleted', error: null };
}
