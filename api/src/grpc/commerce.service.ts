import type { handleUnaryCall } from '@grpc/grpc-js';
import { logger } from '../utils/logger';

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
      try { cb(null, await fn(call, await getRepo(name).catch(() => ({})))); }
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

async function getStripe() {
  try { const m = await import('../services/stripe.service' as string); return m.stripeService || m.default; }
  catch { return null; }
}

export const paymentHandlers = make('payment', {
  CreatePaymentIntent: async (c, _r) => {
    const s = await getStripe();
    if (!s) return ok(JSON.stringify({}), 'Stripe not configured');
    const { amount, currency, metadata, customerId } = c.request;
    const intent = await s.createPaymentIntent(amount, currency || 'usd', metadata ? JSON.parse(metadata) : {}, customerId);
    return ok(JSON.stringify(intent));
  },
  ConfirmPaymentIntent: async (c, _r) => {
    const s = await getStripe();
    if (!s) return ok(JSON.stringify({}), 'Stripe not configured');
    const intent = await s.confirmPaymentIntent(c.request.paymentIntentId);
    return ok(JSON.stringify(intent));
  },
  CreateSetupIntent: async (c, _r) => {
    const s = await getStripe();
    if (!s) return ok(JSON.stringify({}), 'Stripe not configured');
    const intent = await s.createSetupIntent(c.request.customerId);
    return ok(JSON.stringify(intent));
  },
  CreateCustomer: async (c, _r) => {
    const s = await getStripe();
    if (!s) return ok(JSON.stringify({}), 'Stripe not configured');
    const customer = await s.createCustomer(c.request.email, c.request.name, c.request.metadata ? JSON.parse(c.request.metadata) : {});
    return ok(JSON.stringify(customer));
  },
  GetPaymentMethods: async (c, _r) => {
    const s = await getStripe();
    if (!s) return ok(JSON.stringify([]), 'Stripe not configured');
    const methods = await s.getPaymentMethods(c.request.id);
    return ok(JSON.stringify(methods));
  },
  HandleWebhook: async (c, _r) => {
    const s = await getStripe();
    if (!s) return ok(JSON.stringify({}), 'Stripe not configured');
    const event = await s.handleWebhook(c.request.payload, c.request.signature);
    return ok(JSON.stringify(event));
  },
});

export const couponHandlers = make('coupon', {
  GetCoupons: (c, r) => lp(c, r, 'findCoupons'),
  GetCouponById: (c, r) => gi(c, r, 'findCouponById'),
  GetCouponByCode: (c, r) => {
    if (!c.request.code) return Promise.resolve(err('Code required', 'INVALID'));
    return r.findCouponByCode(c.request.code).then((d: any) => d ? ok(d) : err('Not found', 'NOT_FOUND'));
  },
  CreateCoupon: (c, r) => r.createCoupon(c.request).then((d: any) => ok(d, 'Created')),
  UpdateCoupon: (c, r) => {
    const { id, ...data } = c.request;
    if (!id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.updateCoupon(id, data).then((d: any) => ok(d, 'Updated'));
  },
  DeleteCoupon: (c, r) => {
    if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.deleteCoupon(c.request.id).then(() => apiOk('Deleted'));
  },
  ToggleCouponStatus: (c, r) => {
    if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.toggleCouponStatus(c.request.id).then((d: any) => ok(d, 'Toggled'));
  },
  GetCouponStats: async (c, r) => {
    const stats = await (r.getCouponStats?.() ?? {});
    return ok(JSON.stringify(stats));
  },
});

export const shippingHandlers = make('shipping', {
  GetPublicShipping: (_c, r) => r.findActive().then((d: any) => listOk(d)),
  GetShippingItems: (c, r) => r.findByType(c.request.type).then((d: any) => listOk(d)),
  GetShippingItem: (c, r) => gi(c, r, 'findById'),
  CreateShippingItem: (c, r) => r.create(c.request).then((d: any) => ok(d, 'Created')),
  UpdateShippingItem: (c, r) => {
    const { id, ...data } = c.request;
    if (!id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.update(id, data).then((d: any) => ok(d, 'Updated'));
  },
  DeleteShippingItem: (c, r) => {
    if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.delete(c.request.id).then(() => apiOk('Deleted'));
  },
  ToggleShippingItem: (c, r) => {
    if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.toggleStatus(c.request.id).then((d: any) => ok(d, 'Toggled'));
  },
  GetShippingSettings: async (_c, r) => {
    const settings = await (r.getSettings?.() ?? {});
    return ok(JSON.stringify(settings));
  },
  UpdateShippingSettings: async (c, r) => {
    const settings = await (r.updateSettings?.(c.request) ?? {});
    return ok(JSON.stringify(settings), 'Updated');
  },
});

export const deliveryHandlers = make('delivery', {
  CreateDelivery: (c, r) => r.create(c.request).then((d: any) => ok(d, 'Created')),
  GetDeliveryByOrder: (c, r) => {
    if (!c.request.id) return Promise.resolve(err('Order ID required', 'INVALID'));
    return r.findByOrderId(c.request.id).then((d: any) => d ? ok(d) : err('Not found', 'NOT_FOUND'));
  },
  GetDeliveryById: (c, r) => gi(c, r, 'findById'),
  UpdateDeliveryStatus: (c, r) => {
    const { orderId, ...data } = c.request;
    if (!orderId) return Promise.resolve(err('Order ID required', 'INVALID'));
    return r.updateByOrderId(orderId, data).then((d: any) => ok(d, 'Updated'));
  },
  GetActiveDeliveries: (c, r) => r.findActive(c.request.limit, c.request.offset).then((d: any) => listOk(d)),
  GetDeliveriesByStatus: (c, r) => r.findByStatus(c.request.status, c.request.limit, c.request.offset).then((d: any) => listOk(d)),
  GetDeliveryStats: async (_c, r) => {
    const stats = await (r.getStats?.() ?? {});
    return ok(JSON.stringify(stats));
  },
  DeleteDelivery: (c, r) => {
    if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.delete(c.request.id).then(() => apiOk('Deleted'));
  },
});

export const rewardHandlers = make('reward', {
  GetRewardSettings: async (_c, r) => {
    const settings = await (r.getSettings?.() ?? {});
    return ok(JSON.stringify(settings));
  },
  UpdateRewardSettings: async (c, r) => {
    const settings = await (r.updateSettings?.(c.request) ?? {});
    return ok(JSON.stringify(settings), 'Updated');
  },
  GetUserRewards: async (c, r) => {
    const { userId, type, page = 1, limit = 20, search } = c.request;
    return r.findUserRewards(userId, type, page, limit, search).then((res: any) =>
      listOk(res.data, { page, limit, total: res.pagination?.total || 0, totalPages: res.pagination?.pages || 0 })
    );
  },
  GetRewardAnalytics: async (c, r) => {
    const analytics = await (r.getAnalytics?.(c.request.startDate, c.request.endDate) ?? {});
    return ok(JSON.stringify(analytics));
  },
  AddManualReward: async (c, r) => {
    const reward = await r.addManualReward(c.request.userId, c.request.points, c.request.description);
    return ok(reward, 'Added');
  },
  DeleteReward: (c, r) => {
    if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
    return r.delete(c.request.id).then(() => apiOk('Deleted'));
  },
});

export const userRewardHandlers = make('user-reward', {
  GetUserRewardBalance: async (c, _r) => {
    const svc = await import('../services/reward.service' as string).then((m: any) => m.rewardService);
    const balance = await svc.getUserBalance(c.request.userId);
    return { success: true, message: 'OK', balance: balance || 0, error: null };
  },
  GetUserRewardHistory: async (c, _r) => {
    const svc = await import('../services/reward.service' as string).then((m: any) => m.rewardService);
    const { page = 1, limit = 20 } = c.request;
    const history = await svc.getUserHistory(c.request.userId, c.request.type, page, limit);
    return listOk(history.data || history, { page, limit, total: history.pagination?.total || 0, totalPages: history.pagination?.pages || 0 });
  },
  GetPublicRewardSettings: async (_c, _r) => {
    const svc = await import('../services/reward.service' as string).then((m: any) => m.rewardService);
    const settings = await svc.getPublicSettings();
    return ok(JSON.stringify(settings));
  },
  CalculateRewards: async (c, _r) => {
    const svc = await import('../services/reward.service' as string).then((m: any) => m.rewardService);
    const pts = await svc.calculatePoints(c.request.amount);
    return { success: true, message: 'OK', points: pts || 0, error: null };
  },
});
