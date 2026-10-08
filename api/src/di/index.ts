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
import { IUserService } from '../interfaces/services/user.service.js';
import { IProductRepository } from '../interfaces/repositories/product.repository.js';
import { IOrderRepository } from '../interfaces/repositories/order.repository.js';
import { ICategoryRepository } from '../interfaces/repositories/category.repository.js';
import { IInventoryRepository } from '../interfaces/repositories/inventory.repository.js';
import { ICartRepository } from '../interfaces/repositories/cart.repository.js';
import { IShippingRepository } from '../interfaces/repositories/shipping.repository.js';
import { IDeliveryRepository } from '../interfaces/repositories/delivery.repository.js';
import { IBannerRepository } from '../interfaces/repositories/banner.repository.js';
import { IHeroSlideRepository } from '../interfaces/repositories/hero-slide.repository.js';
import { ICouponRepository } from '../interfaces/repositories/coupon.repository.js';
import { IStoreRepository } from '../interfaces/repositories/store.repository.js';
import { IFAQRepository } from '../interfaces/repositories/faq.repository.js';
import { INotificationRepository } from '../interfaces/repositories/notification.repository.js';
import { ICacheService } from '../interfaces/services/cache.service.js';
import { initializeDI } from './registrations.js';

declare global {
  var __DI_CONTAINER__: Container | undefined;
}

export const getContainer = async (): Promise<Container> => {
  if (!global.__DI_CONTAINER__) {
    global.__DI_CONTAINER__ = await initializeDI();
  }
  return global.__DI_CONTAINER__!;
};

export const resetContainer = (): void => {
  global.__DI_CONTAINER__ = undefined;
};

export { initializeDI };

export const resolveUserRepository = async (): Promise<IUserRepository> => {
  const container = await getContainer();
  return container.resolve<IUserRepository>(USER_REPOSITORY_TOKEN);
};

export const resolveUserService = async (): Promise<IUserService> => {
  const container = await getContainer();
  return container.resolve<IUserService>(USER_SERVICE_TOKEN);
};

export const resolveCacheService = async (): Promise<ICacheService> => {
  const container = await getContainer();
  return container.resolve<ICacheService>(CACHE_SERVICE_TOKEN);
};

export const resolveProductRepository = async (): Promise<IProductRepository> => {
  const container = await getContainer();
  return container.resolve<IProductRepository>(PRODUCT_REPOSITORY_TOKEN);
};

export const resolveOrderRepository = async (): Promise<IOrderRepository> => {
  const container = await getContainer();
  return container.resolve<IOrderRepository>(ORDER_REPOSITORY_TOKEN);
};

export const resolveCategoryRepository = async (): Promise<ICategoryRepository> => {
  const container = await getContainer();
  return container.resolve<ICategoryRepository>(CATEGORY_REPOSITORY_TOKEN);
};

export const resolveInventoryRepository = async (): Promise<IInventoryRepository> => {
  const container = await getContainer();
  return container.resolve<IInventoryRepository>(INVENTORY_REPOSITORY_TOKEN);
};

export const resolveCartRepository = async (): Promise<ICartRepository> => {
  const container = await getContainer();
  return container.resolve<ICartRepository>(CART_REPOSITORY_TOKEN);
};

export const resolveShippingRepository = async (): Promise<IShippingRepository> => {
  const container = await getContainer();
  return container.resolve<IShippingRepository>(SHIPPING_REPOSITORY_TOKEN);
};

export const resolveDeliveryRepository = async (): Promise<IDeliveryRepository> => {
  const container = await getContainer();
  return container.resolve<IDeliveryRepository>(DELIVERY_REPOSITORY_TOKEN);
};

export const resolveBannerRepository = async (): Promise<IBannerRepository> => {
  const container = await getContainer();
  return container.resolve<IBannerRepository>(BANNER_REPOSITORY_TOKEN);
};

export const resolveHeroSlideRepository = async (): Promise<IHeroSlideRepository> => {
  const container = await getContainer();
  return container.resolve<IHeroSlideRepository>(HERO_SLIDE_REPOSITORY_TOKEN);
};

export const resolveCouponRepository = async (): Promise<ICouponRepository> => {
  const container = await getContainer();
  return container.resolve<ICouponRepository>(COUPON_REPOSITORY_TOKEN);
};

export const resolveStoreRepository = async (): Promise<IStoreRepository> => {
  const container = await getContainer();
  return container.resolve<IStoreRepository>(STORE_REPOSITORY_TOKEN);
};

export const resolveFAQRepository = async (): Promise<IFAQRepository> => {
  const container = await getContainer();
  return container.resolve<IFAQRepository>(FAQ_REPOSITORY_TOKEN);
};

export const resolveNotificationRepository = async (): Promise<INotificationRepository> => {
  const container = await getContainer();
  return container.resolve<INotificationRepository>(NOTIFICATION_REPOSITORY_TOKEN);
};

export const createTestContainer = async (overrides: Partial<{
  userRepository: IUserRepository;
  userService: IUserService;
  productRepository: IProductRepository;
  orderRepository: IOrderRepository;
  categoryRepository: ICategoryRepository;
  inventoryRepository: IInventoryRepository;
  cartRepository: ICartRepository;
  shippingRepository: IShippingRepository;
  deliveryRepository: IDeliveryRepository;
  bannerRepository: IBannerRepository;
  heroSlideRepository: IHeroSlideRepository;
  couponRepository: ICouponRepository;
  storeRepository: IStoreRepository;
  faqRepository: IFAQRepository;
  notificationRepository: INotificationRepository;
  cacheService: ICacheService;
}> = {}): Promise<Container> => {
  const container = new Container();
  
  if (overrides.cacheService) {
    container.registerInstance(CACHE_SERVICE_TOKEN, overrides.cacheService);
  }
  
  if (overrides.userRepository) {
    container.registerInstance(USER_REPOSITORY_TOKEN, overrides.userRepository);
  } else if (overrides.userRepository === undefined) {
    container.register(USER_REPOSITORY_TOKEN, async () => { throw new Error('userRepository not provided'); }, true);
  }
  
  if (overrides.productRepository) {
    container.registerInstance(PRODUCT_REPOSITORY_TOKEN, overrides.productRepository);
  } else if (overrides.productRepository === undefined) {
    container.register(PRODUCT_REPOSITORY_TOKEN, async () => { throw new Error('productRepository not provided'); }, true);
  }
  
  if (overrides.orderRepository) {
    container.registerInstance(ORDER_REPOSITORY_TOKEN, overrides.orderRepository);
  } else if (overrides.orderRepository === undefined) {
    container.register(ORDER_REPOSITORY_TOKEN, async () => { throw new Error('orderRepository not provided'); }, true);
  }
  
  if (overrides.categoryRepository) {
    container.registerInstance(CATEGORY_REPOSITORY_TOKEN, overrides.categoryRepository);
  } else if (overrides.categoryRepository === undefined) {
    container.register(CATEGORY_REPOSITORY_TOKEN, async () => { throw new Error('categoryRepository not provided'); }, true);
  }
  
  if (overrides.inventoryRepository) {
    container.registerInstance(INVENTORY_REPOSITORY_TOKEN, overrides.inventoryRepository);
  } else if (overrides.inventoryRepository === undefined) {
    container.register(INVENTORY_REPOSITORY_TOKEN, async () => { throw new Error('inventoryRepository not provided'); }, true);
  }
  
  if (overrides.cartRepository) {
    container.registerInstance(CART_REPOSITORY_TOKEN, overrides.cartRepository);
  } else if (overrides.cartRepository === undefined) {
    container.register(CART_REPOSITORY_TOKEN, async () => { throw new Error('cartRepository not provided'); }, true);
  }
  
  if (overrides.shippingRepository) {
    container.registerInstance(SHIPPING_REPOSITORY_TOKEN, overrides.shippingRepository);
  } else if (overrides.shippingRepository === undefined) {
    container.register(SHIPPING_REPOSITORY_TOKEN, async () => { throw new Error('shippingRepository not provided'); }, true);
  }
  
  if (overrides.deliveryRepository) {
    container.registerInstance(DELIVERY_REPOSITORY_TOKEN, overrides.deliveryRepository);
  } else if (overrides.deliveryRepository === undefined) {
    container.register(DELIVERY_REPOSITORY_TOKEN, async () => { throw new Error('deliveryRepository not provided'); }, true);
  }
  
  if (overrides.bannerRepository) {
    container.registerInstance(BANNER_REPOSITORY_TOKEN, overrides.bannerRepository);
  } else if (overrides.bannerRepository === undefined) {
    container.register(BANNER_REPOSITORY_TOKEN, async () => { throw new Error('bannerRepository not provided'); }, true);
  }
  
  if (overrides.heroSlideRepository) {
    container.registerInstance(HERO_SLIDE_REPOSITORY_TOKEN, overrides.heroSlideRepository);
  } else if (overrides.heroSlideRepository === undefined) {
    container.register(HERO_SLIDE_REPOSITORY_TOKEN, async () => { throw new Error('heroSlideRepository not provided'); }, true);
  }
  
  if (overrides.couponRepository) {
    container.registerInstance(COUPON_REPOSITORY_TOKEN, overrides.couponRepository);
  } else if (overrides.couponRepository === undefined) {
    container.register(COUPON_REPOSITORY_TOKEN, async () => { throw new Error('couponRepository not provided'); }, true);
  }
  
  if (overrides.storeRepository) {
    container.registerInstance(STORE_REPOSITORY_TOKEN, overrides.storeRepository);
  } else if (overrides.storeRepository === undefined) {
    container.register(STORE_REPOSITORY_TOKEN, async () => { throw new Error('storeRepository not provided'); }, true);
  }
  
  if (overrides.faqRepository) {
    container.registerInstance(FAQ_REPOSITORY_TOKEN, overrides.faqRepository);
  } else if (overrides.faqRepository === undefined) {
    container.register(FAQ_REPOSITORY_TOKEN, async () => { throw new Error('faqRepository not provided'); }, true);
  }
  
  if (overrides.notificationRepository) {
    container.registerInstance(NOTIFICATION_REPOSITORY_TOKEN, overrides.notificationRepository);
  } else if (overrides.notificationRepository === undefined) {
    container.register(NOTIFICATION_REPOSITORY_TOKEN, async () => { throw new Error('notificationRepository not provided'); }, true);
  }
  
  if (overrides.userService) {
    container.registerInstance(USER_SERVICE_TOKEN, overrides.userService);
  } else if (overrides.userService === undefined) {
    container.register(USER_SERVICE_TOKEN, async () => { throw new Error('userService not provided'); }, true);
  }
  
  return container;
};