import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { logger } from '../utils/logger';
import { authHandlers } from './auth.service';
import { userHandlers } from './user.service';
import { productHandlers } from './product.service';
import { orderHandlers } from './order.service';
import {
  bannerHandlers, heroBannerHandlers, editorialSectionHandlers,
  dualCardSectionHandlers, featuredSectionHandlers, followSectionHandlers,
  salesBannerHandlers, contentHandlers,
} from './cms.service';
import {
  categoryHandlers, cartHandlers, navigationHandlers,
  footerCatalogHandlers, footerSectionHandlers, shopByCategoryHandlers, storeHandlers,
} from './store.service';
import {
  staffHandlers, analyticsHandlers, settingsHandlers,
  colorThemeHandlers, seoHandlers, jsonLdHandlers,
} from './admin.service';
import {
  paymentHandlers, couponHandlers, shippingHandlers,
  deliveryHandlers, rewardHandlers, userRewardHandlers,
} from './commerce.service';
import {
  inventoryHandlers, posHandlers, notificationHandlers,
  contactHandlers, faqHandlers, attributeOptionHandlers,
  addressHandlers, publicUserHandlers,
} from './other.service';

const GRPC_PORT = parseInt(process.env.GRPC_PORT || '50051', 10);

function loadProto(protoPath: string, includeDirs: string[]) {
  return grpc.loadPackageDefinition(
    protoLoader.loadSync(protoPath, {
      keepCase: false,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs,
    }),
  );
}

interface ServiceRegistration {
  protoFile: string;
  packagePath: string[];
  serviceName: string;
  handlers: Record<string, any>;
}

const SERVICE_REGISTRATIONS: ServiceRegistration[] = [
  { protoFile: 'auth.proto', packagePath: ['rapharch', 'auth'], serviceName: 'AuthService', handlers: authHandlers },
  { protoFile: 'user.proto', packagePath: ['rapharch', 'user'], serviceName: 'UserService', handlers: userHandlers },
  { protoFile: 'product.proto', packagePath: ['rapharch', 'product'], serviceName: 'ProductService', handlers: productHandlers },
  { protoFile: 'order.proto', packagePath: ['rapharch', 'order'], serviceName: 'OrderService', handlers: orderHandlers },
  { protoFile: 'cms.proto', packagePath: ['rapharch', 'cms'], serviceName: 'BannerService', handlers: bannerHandlers },
  { protoFile: 'cms.proto', packagePath: ['rapharch', 'cms'], serviceName: 'HeroBannerService', handlers: heroBannerHandlers },
  { protoFile: 'cms.proto', packagePath: ['rapharch', 'cms'], serviceName: 'EditorialSectionService', handlers: editorialSectionHandlers },
  { protoFile: 'cms.proto', packagePath: ['rapharch', 'cms'], serviceName: 'DualCardSectionService', handlers: dualCardSectionHandlers },
  { protoFile: 'cms.proto', packagePath: ['rapharch', 'cms'], serviceName: 'FeaturedSectionService', handlers: featuredSectionHandlers },
  { protoFile: 'cms.proto', packagePath: ['rapharch', 'cms'], serviceName: 'FollowSectionService', handlers: followSectionHandlers },
  { protoFile: 'cms.proto', packagePath: ['rapharch', 'cms'], serviceName: 'SalesBannerService', handlers: salesBannerHandlers },
  { protoFile: 'cms.proto', packagePath: ['rapharch', 'cms'], serviceName: 'ContentService', handlers: contentHandlers },
  { protoFile: 'store.proto', packagePath: ['rapharch', 'store'], serviceName: 'CategoryService', handlers: categoryHandlers },
  { protoFile: 'store.proto', packagePath: ['rapharch', 'store'], serviceName: 'CartService', handlers: cartHandlers },
  { protoFile: 'store.proto', packagePath: ['rapharch', 'store'], serviceName: 'NavigationService', handlers: navigationHandlers },
  { protoFile: 'store.proto', packagePath: ['rapharch', 'store'], serviceName: 'FooterCatalogService', handlers: footerCatalogHandlers },
  { protoFile: 'store.proto', packagePath: ['rapharch', 'store'], serviceName: 'FooterSectionService', handlers: footerSectionHandlers },
  { protoFile: 'store.proto', packagePath: ['rapharch', 'store'], serviceName: 'ShopByCategoryService', handlers: shopByCategoryHandlers },
  { protoFile: 'store.proto', packagePath: ['rapharch', 'store'], serviceName: 'StoreService', handlers: storeHandlers },
  { protoFile: 'admin.proto', packagePath: ['rapharch', 'admin'], serviceName: 'StaffService', handlers: staffHandlers },
  { protoFile: 'admin.proto', packagePath: ['rapharch', 'admin'], serviceName: 'AnalyticsService', handlers: analyticsHandlers },
  { protoFile: 'admin.proto', packagePath: ['rapharch', 'admin'], serviceName: 'SettingsService', handlers: settingsHandlers },
  { protoFile: 'admin.proto', packagePath: ['rapharch', 'admin'], serviceName: 'ColorThemeService', handlers: colorThemeHandlers },
  { protoFile: 'admin.proto', packagePath: ['rapharch', 'admin'], serviceName: 'SeoService', handlers: seoHandlers },
  { protoFile: 'admin.proto', packagePath: ['rapharch', 'admin'], serviceName: 'JsonLdService', handlers: jsonLdHandlers },
  { protoFile: 'commerce.proto', packagePath: ['rapharch', 'commerce'], serviceName: 'PaymentService', handlers: paymentHandlers },
  { protoFile: 'commerce.proto', packagePath: ['rapharch', 'commerce'], serviceName: 'CouponService', handlers: couponHandlers },
  { protoFile: 'commerce.proto', packagePath: ['rapharch', 'commerce'], serviceName: 'ShippingService', handlers: shippingHandlers },
  { protoFile: 'commerce.proto', packagePath: ['rapharch', 'commerce'], serviceName: 'DeliveryService', handlers: deliveryHandlers },
  { protoFile: 'commerce.proto', packagePath: ['rapharch', 'commerce'], serviceName: 'RewardService', handlers: rewardHandlers },
  { protoFile: 'commerce.proto', packagePath: ['rapharch', 'commerce'], serviceName: 'UserRewardService', handlers: userRewardHandlers },
  { protoFile: 'other.proto', packagePath: ['rapharch', 'other'], serviceName: 'InventoryService', handlers: inventoryHandlers },
  { protoFile: 'other.proto', packagePath: ['rapharch', 'other'], serviceName: 'PosService', handlers: posHandlers },
  { protoFile: 'other.proto', packagePath: ['rapharch', 'other'], serviceName: 'NotificationService', handlers: notificationHandlers },
  { protoFile: 'other.proto', packagePath: ['rapharch', 'other'], serviceName: 'ContactService', handlers: contactHandlers },
  { protoFile: 'other.proto', packagePath: ['rapharch', 'other'], serviceName: 'FaqService', handlers: faqHandlers },
  { protoFile: 'other.proto', packagePath: ['rapharch', 'other'], serviceName: 'AttributeOptionService', handlers: attributeOptionHandlers },
  { protoFile: 'other.proto', packagePath: ['rapharch', 'other'], serviceName: 'AddressService', handlers: addressHandlers },
  { protoFile: 'other.proto', packagePath: ['rapharch', 'other'], serviceName: 'PublicUserService', handlers: publicUserHandlers },
];

const loadedProtos: Record<string, any> = {};

function getLoadedProto(protoFile: string, includeDirs: string[]) {
  if (!loadedProtos[protoFile]) {
    const dir = includeDirs[0] || '';
    loadedProtos[protoFile] = loadProto(
      path.join(dir, protoFile),
      includeDirs,
    );
  }
  return loadedProtos[protoFile];
}

function resolveService(protoDef: any, packagePath: string[], serviceName: string): any {
  let current = protoDef;
  for (const segment of packagePath) {
    current = current?.[segment];
    if (!current) return null;
  }
  return current?.[serviceName];
}

export function createGrpcServer(): grpc.Server {
  const server = new grpc.Server({
    'grpc.max_receive_message_length': 10 * 1024 * 1024,
    'grpc.max_send_message_length': 10 * 1024 * 1024,
  });

  const protoDir = path.join(__dirname, '..', 'proto');
  const includeDirs = [protoDir];

  let registeredCount = 0;

  for (const reg of SERVICE_REGISTRATIONS) {
    try {
      const protoDef = getLoadedProto(reg.protoFile, includeDirs);
      const serviceDef = resolveService(protoDef, reg.packagePath, reg.serviceName);
      if (serviceDef?.service) {
        server.addService(serviceDef.service, reg.handlers);
        registeredCount++;
      } else {
        logger.warn(`gRPC ${reg.serviceName} service definition not found in ${reg.protoFile}`);
      }
    } catch (error) {
      logger.error(`Failed to register gRPC ${reg.serviceName}`, { protoFile: reg.protoFile }, error as Error);
    }
  }

  logger.info(`gRPC server configured with ${registeredCount} services`);
  return server;
}

export async function startGrpcServer(server?: grpc.Server): Promise<grpc.Server> {
  const gServer = server || createGrpcServer();

  return new Promise((resolve, reject) => {
    gServer.bindAsync(
      `0.0.0.0:${GRPC_PORT}`,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          reject(error);
          return;
        }
        gServer.start();
        logger.info(`gRPC server running on port ${port}`);
        resolve(gServer);
      },
    );
  });
}

export async function stopGrpcServer(server: grpc.Server): Promise<void> {
  return new Promise((resolve) => {
    server.tryShutdown(() => {
      logger.info('gRPC server shut down');
      resolve();
    });
  });
}
