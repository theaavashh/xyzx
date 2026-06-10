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

function gi(c: any, r: any, fn: string) {
  if (!c.request.id) return Promise.resolve(err('ID required', 'INVALID'));
  return r[fn](c.request.id).then((d: any) => d ? ok(d) : err('Not found', 'NOT_FOUND'));
}

export const inventoryHandlers = make('inventory', {
  GetInventoryStats: async (_c, _r) => {
    const stats = {
      totalProducts: await prisma.product.count(),
      lowStock: await prisma.product.count({ where: { trackQuantity: true, quantity: { lte: 5 } } }),
      outOfStock: await prisma.product.count({ where: { trackQuantity: true, quantity: 0 } }),
    };
    return ok(JSON.stringify(stats));
  },
  GetStock: async (c, _r) => {
    if (!c.request.id) return err('Product ID required', 'INVALID');
    const p = await prisma.product.findUnique({ where: { id: c.request.id }, select: { id: true, quantity: true, trackQuantity: true, lowStockThreshold: true } });
    return ok(JSON.stringify(p));
  },
  UpdateStock: async (c, _r) => {
    const repo = await getRepo('inventory');
    const result = await repo.updateStock(c.request.productId, c.request.quantity, c.request.changeType, c.request.source, c.request.reason);
    return ok(JSON.stringify(result), 'Updated');
  },
  GetLowStockProducts: async (c, _r) => {
    const threshold = c.request.threshold || 5;
    const products = await prisma.product.findMany({ where: { trackQuantity: true, quantity: { lte: threshold } }, orderBy: { quantity: 'asc' } });
    return ok(JSON.stringify(products));
  },
  GetInventoryLogs: async (c, _r) => {
    const repo = await getRepo('inventory');
    const logs = await repo.getLogs(c.request.productId, c.request.limit, c.request.offset);
    return ok(JSON.stringify(logs));
  },
  DeductStockForStoreSale: async (c, _r) => {
    const repo = await getRepo('inventory');
    const result = await repo.deductStockForOrder(
      (c.request.items || []).map((i: any) => ({ productId: i.productId, quantity: i.quantity })),
      c.request.saleId, 'STORE',
    );
    return ok(JSON.stringify(result), 'Stock deducted');
  },
  BulkUpdateStock: async (c, _r) => {
    const repo = await getRepo('inventory');
    const results = [];
    for (const u of (c.request.updates || [])) {
      results.push(await repo.updateStock(u.productId, u.quantity, u.changeType, 'BULK', u.reason));
    }
    return ok(JSON.stringify(results), 'Bulk updated');
  },
});

export const posHandlers = make('pos', {
  CreatePosSale: async (c, _r) => {
    const { items, customerName, customerPhone, subtotal, tax, discount, total, paymentMethod } = c.request;
    const repo = await getRepo('pos') || await getRepo('order');
    const sale = await (repo.createPosSale?.({
      items: (items || []).map((i: any) => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
      customerName, customerPhone, subtotal, tax, discount, total, paymentMethod,
    }) ?? prisma.order.create({ data: { orderNumber: `POS-${Date.now()}`, total: total || 0, subtotal: subtotal || 0, paymentMethod: paymentMethod || 'CASH', items: { create: (items || []).map((i: any) => ({ productId: i.productId, quantity: i.quantity, price: i.price })) } } }));
    return ok(JSON.stringify(sale), 'Sale created');
  },
  ListPosSales: async (c, _r) => {
    const { page = 1, limit = 20, search } = c.request;
    const where: any = {};
    if (search) where.OR = [{ orderNumber: { contains: search } }, { billingName: { contains: search } }];
    const [data, total] = await Promise.all([
      prisma.order.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.order.count({ where }),
    ]);
    return { success: true, message: 'OK', data: JSON.stringify(data), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }, error: null };
  },
  GetPosSale: async (c, _r) => {
    const d = await prisma.order.findUnique({ where: { id: c.request.id } });
    return ok(JSON.stringify(d));
  },
});

export const notificationHandlers = make('notification', {
  GetNotifications: async (c, _r) => {
    const repo = await getRepo('notification');
    const { userId, unread, limit = 20, offset = 0 } = c.request;
    const where: any = { userId };
    if (unread) where.isRead = false;
    const [data, total] = await Promise.all([
      repo.findNotifications(userId, unread, limit, offset),
      repo.countNotifications?.(userId, unread) ?? prisma.notification.count({ where }),
    ]);
    return listOk(data || [], { page: Math.floor(offset / limit) + 1, limit, total, totalPages: Math.ceil(total / limit) });
  },
  CreateNotification: async (c, _r) => {
    const repo = await getRepo('notification');
    const n = await (repo.createNotification?.(c.request) ?? prisma.notification.create({ data: c.request }));
    return ok(n, 'Created');
  },
  CreateBulkNotifications: async (c, _r) => {
    const repo = await getRepo('notification');
    await (repo.createBulkNotifications?.(c.request.userIds, { title: c.request.title, message: c.request.message, type: c.request.type, link: c.request.link })
      ?? Promise.all((c.request.userIds || []).map((uid: string) => prisma.notification.create({ data: { userId: uid, title: c.request.title, message: c.request.message, type: c.request.type || 'info', link: c.request.link } }))));
    return apiOk('Notifications sent');
  },
  MarkAsRead: async (c, _r) => {
    const n = await prisma.notification.update({ where: { id: c.request.id }, data: { isRead: true } });
    return ok(n, 'Marked as read');
  },
  MarkAllAsRead: async (c, _r) => {
    await prisma.notification.updateMany({ where: { userId: c.request.userId, isRead: false }, data: { isRead: true } });
    return apiOk('All marked as read');
  },
  MarkAsUnread: async (c, _r) => {
    const n = await prisma.notification.update({ where: { id: c.request.id }, data: { isRead: false } });
    return ok(n, 'Marked as unread');
  },
  DeleteNotification: async (c, _r) => {
    await prisma.notification.delete({ where: { id: c.request.id } });
    return apiOk('Deleted');
  },
  ClearAll: async (c, _r) => {
    await prisma.notification.deleteMany({ where: { userId: c.request.userId } });
    return apiOk('Cleared');
  },
  GetUnreadCount: async (c, _r) => {
    const count = await prisma.notification.count({ where: { userId: c.request.userId, isRead: false } });
    return { success: true, message: 'OK', count, error: null };
  },
});

export const contactHandlers = make('contact', {
  SubmitContact: async (c, _r) => {
    await prisma.contactSubmission.create({ data: { name: c.request.name, email: c.request.email, subject: c.request.subject, message: c.request.message } });
    return apiOk('Submitted');
  },
  GetSubmissions: async (_c, _r) => {
    const data = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
    return listOk(data);
  },
  GetSubmission: async (c, _r) => {
    const d = await prisma.contactSubmission.findUnique({ where: { id: c.request.id } });
    return d ? ok(d) : err('Not found', 'NOT_FOUND');
  },
  DeleteSubmission: async (c, _r) => {
    await prisma.contactSubmission.delete({ where: { id: c.request.id } });
    return apiOk('Deleted');
  },
  MarkContactAsRead: async (c, _r) => {
    await prisma.contactSubmission.update({ where: { id: c.request.id }, data: { isRead: true } });
    return apiOk('Marked as read');
  },
});

export const faqHandlers = make('faq', {
  GetFAQs: async (_c, _r) => {
    const data = await prisma.faq.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
    return listOk(data);
  },
  GetAllFAQs: async (_c, _r) => {
    const data = await prisma.faq.findMany({ orderBy: { order: 'asc' } });
    return listOk(data);
  },
  GetFAQById: (c, r) => gi(c, r, 'findById'),
  CreateFAQ: async (c, _r) => {
    const d = await prisma.faq.create({ data: c.request });
    return ok(d, 'Created');
  },
  UpdateFAQ: async (c, _r) => {
    const { id, ...data } = c.request;
    const d = await prisma.faq.update({ where: { id }, data });
    return ok(d, 'Updated');
  },
  DeleteFAQ: async (c, _r) => {
    await prisma.faq.delete({ where: { id: c.request.id } });
    return apiOk('Deleted');
  },
  ToggleFAQStatus: async (c, _r) => {
    const faq = await prisma.faq.findUnique({ where: { id: c.request.id } });
    const d = await prisma.faq.update({ where: { id: c.request.id }, data: { isActive: !faq?.isActive } });
    return ok(d, 'Toggled');
  },
});

export const attributeOptionHandlers = make('attribute-option', {
  GetAttributeOptions: async (c, _r) => {
    const where: any = {};
    if (c.request.type) where.type = c.request.type;
    if (c.request.isActive !== undefined) where.isActive = c.request.isActive;
    const data = await prisma.attributeOption.findMany({ where, orderBy: { sortOrder: 'asc' } });
    return listOk(data);
  },
  CreateAttributeOption: async (c, _r) => {
    const d = await prisma.attributeOption.create({ data: c.request });
    return ok(d, 'Created');
  },
  DeleteAttributeOption: async (c, _r) => {
    await prisma.attributeOption.delete({ where: { id: c.request.id } });
    return apiOk('Deleted');
  },
});

export const addressHandlers = make('address', {
  GetAddresses: async (c, _r) => {
    const data = await prisma.address.findMany({ where: { userId: c.request.userId }, orderBy: { createdAt: 'desc' } });
    return listOk(data);
  },
  CreateAddress: async (c, _r) => {
    const { userId, ...rest } = c.request;
    if (rest.isDefault) await prisma.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    const d = await prisma.address.create({ data: { userId, ...rest } });
    return ok(d, 'Created');
  },
  UpdateAddress: async (c, _r) => {
    const { id, userId, ...data } = c.request;
    if (data.isDefault) await prisma.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    const d = await prisma.address.update({ where: { id }, data });
    return ok(d, 'Updated');
  },
  DeleteAddress: async (c, _r) => {
    await prisma.address.delete({ where: { id: c.request.id, userId: c.request.userId } });
    return apiOk('Deleted');
  },
  SetDefaultAddress: async (c, _r) => {
    const addr = await prisma.address.findUnique({ where: { id: c.request.id } });
    if (!addr) return err('Not found', 'NOT_FOUND');
    await prisma.address.updateMany({ where: { userId: addr.userId, isDefault: true }, data: { isDefault: false } });
    const d = await prisma.address.update({ where: { id: c.request.id }, data: { isDefault: true } });
    return ok(d, 'Default set');
  },
});

export const publicUserHandlers = make('public-user', {
  CreatePublicUser: async (c, _r) => {
    const svc = await import('../services/user.service' as string).then((m: any) => m.userService);
    const user = await svc.createUser(c.request.name, c.request.email, c.request.password);
    const emailSvc = await import('../services/email.service' as string).then((m: any) => m.emailService);
    emailSvc.sendWelcomeEmail(c.request.email, c.request.name).catch(() => {});
    return ok(JSON.stringify({ id: user.id, email: user.email, name: user.name }), 'Created');
  },
});
