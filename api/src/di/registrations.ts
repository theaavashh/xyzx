import { Container } from './container.js';
import { CACHE_SERVICE_TOKEN } from '../interfaces/services/cache.service.js';
import { USER_REPOSITORY_TOKEN } from '../interfaces/repositories/user.repository.js';
import { USER_SERVICE_TOKEN } from '../interfaces/services/user.service.js';
import { PRODUCT_REPOSITORY_TOKEN } from '../interfaces/repositories/product.repository.js';
import { ORDER_REPOSITORY_TOKEN } from '../interfaces/repositories/order.repository.js';
import { CATEGORY_REPOSITORY_TOKEN } from '../interfaces/repositories/category.repository.js';
import { INVENTORY_REPOSITORY_TOKEN } from '../interfaces/repositories/inventory.repository.js';
import { CART_REPOSITORY_TOKEN } from '../interfaces/repositories/cart.repository.js';
import { SHIPPING_REPOSITORY_TOKEN } from '../interfaces/repositories/shipping.repository.js';
import { DELIVERY_REPOSITORY_TOKEN } from '../interfaces/repositories/delivery.repository.js';
import { BANNER_REPOSITORY_TOKEN } from '../interfaces/repositories/banner.repository.js';
import { HERO_SLIDE_REPOSITORY_TOKEN } from '../interfaces/repositories/hero-slide.repository.js';
import { COUPON_REPOSITORY_TOKEN } from '../interfaces/repositories/coupon.repository.js';
import { STORE_REPOSITORY_TOKEN } from '../interfaces/repositories/store.repository.js';
import { FAQ_REPOSITORY_TOKEN } from '../interfaces/repositories/faq.repository.js';
import { NOTIFICATION_REPOSITORY_TOKEN } from '../interfaces/repositories/notification.repository.js';
import { IUserRepository } from '../interfaces/repositories/user.repository.js';
import { IProductRepository } from '../interfaces/repositories/product.repository.js';
import { createUserRepository } from '../repositories/user.repository.di.js';
import { createProductRepository } from '../repositories/product.repository.di.js';
import { createOrderRepository } from '../repositories/order.repository.di.js';
import { createCategoryRepository } from '../repositories/category.repository.di.js';
import { createInventoryRepository } from '../repositories/inventory.repository.di.js';
import { createCartRepository } from '../repositories/cart.repository.di.js';
import { createShippingRepository } from '../repositories/shipping.repository.di.js';
import { createDeliveryRepository } from '../repositories/delivery.repository.di.js';
import { createBannerRepository } from '../repositories/banner.repository.di.js';
import { createHeroSlideRepository } from '../repositories/hero-slide.repository.di.js';
import { createCouponRepository } from '../repositories/coupon.repository.di.js';
import { createStoreRepository } from '../repositories/store.repository.di.js';
import { createFAQRepository } from '../repositories/faq.repository.di.js';
import { createNotificationRepository } from '../repositories/notification.repository.di.js';
import { createUserService } from '../services/user.service.di.js';
import { prisma } from '../lib/database.js';
import { createInMemoryCacheService, createRedisCacheService, useRedis } from '../services/cache.service.js';
import { getCacheConfig } from '../config/env-config.js';
import { ICacheService } from '../interfaces/services/cache.service.js';

export const registerRepositories = (container: Container): Container => {
  container.register(USER_REPOSITORY_TOKEN, async (c) => {
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createUserRepository(prisma, cacheService);
  }, true);

  container.register(PRODUCT_REPOSITORY_TOKEN, async (c) => {
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createProductRepository(prisma, cacheService);
  }, true);

  container.register(ORDER_REPOSITORY_TOKEN, async (c) => {
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createOrderRepository(prisma, cacheService);
  }, true);

  container.register(CATEGORY_REPOSITORY_TOKEN, async (c) => {
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createCategoryRepository(prisma, cacheService);
  }, true);

  container.register(INVENTORY_REPOSITORY_TOKEN, async (c) => {
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createInventoryRepository(prisma, cacheService);
  }, true);

  container.register(CART_REPOSITORY_TOKEN, async (c) => {
    return createCartRepository(prisma);
  }, true);

  container.register(SHIPPING_REPOSITORY_TOKEN, async (c) => {
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createShippingRepository(prisma, cacheService);
  }, true);

  container.register(DELIVERY_REPOSITORY_TOKEN, async (c) => {
    return createDeliveryRepository(prisma);
  }, true);

  container.register(BANNER_REPOSITORY_TOKEN, async (c) => {
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createBannerRepository(prisma, cacheService);
  }, true);

  container.register(HERO_SLIDE_REPOSITORY_TOKEN, async (c) => {
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createHeroSlideRepository(prisma, cacheService);
  }, true);

  container.register(COUPON_REPOSITORY_TOKEN, async (c) => {
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createCouponRepository(prisma, cacheService);
  }, true);

  container.register(STORE_REPOSITORY_TOKEN, async (c) => {
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createStoreRepository(prisma, cacheService);
  }, true);

  container.register(FAQ_REPOSITORY_TOKEN, async (c) => {
    return createFAQRepository(prisma);
  }, true);

  container.register(NOTIFICATION_REPOSITORY_TOKEN, async (c) => {
    return createNotificationRepository(prisma);
  }, true);

  return container;
};

export const registerServices = (container: Container): Container => {
  container.register(USER_SERVICE_TOKEN, async (c) => {
    const userRepository = await c.resolve<IUserRepository>(USER_REPOSITORY_TOKEN);
    const cacheService = await c.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
    return createUserService(userRepository, cacheService);
  }, true);

  return container;
};

export const buildContainer = async (): Promise<Container> => {
  const container = new Container();
  
  const cacheConfig = getCacheConfig();
  
  container.register<ICacheService>(CACHE_SERVICE_TOKEN, async () => {
    return useRedis 
      ? createRedisCacheService(cacheConfig)
      : createInMemoryCacheService(cacheConfig);
  }, true);

  // Register repositories
  registerRepositories(container);

  // Register services
  registerServices(container);

  // Initialize cache
  const cacheService = await container.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
  await cacheService.connect();

  return container;
};

export const initializeDI = async (): Promise<Container> => {
  const container = await buildContainer();
  return container;
};

export const resetContainer = (): void => {
  // Global container is reset via index.ts
  // This is here for API completeness
};