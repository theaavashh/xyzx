-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_role_isActive_idx`(`role`, `isActive`),
    INDEX `users_email_isActive_idx`(`email`, `isActive`),
    INDEX `users_createdAt_idx`(`createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `internalLink` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `parentId` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `keywords` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categories_slug_key`(`slug`),
    INDEX `categories_isActive_idx`(`isActive`),
    INDEX `categories_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banners` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `position` VARCHAR(191) NOT NULL DEFAULT 'top',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `banners_isActive_position_idx`(`isActive`, `position`),
    INDEX `banners_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hero_banners` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `largeImage` VARCHAR(191) NULL,
    `smallImage` VARCHAR(191) NULL,
    `videoUrl` VARCHAR(191) NULL,
    `buttonUrl` VARCHAR(191) NULL,
    `buttonText` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `hero_banners_isActive_order_idx`(`isActive`, `order`),
    INDEX `hero_banners_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `featured_sections` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `subtitle` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `ctaUrl` VARCHAR(191) NULL,
    `ctaText` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `featured_sections_isActive_order_idx`(`isActive`, `order`),
    INDEX `featured_sections_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `productCode` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `shortDescription` VARCHAR(191) NULL,
    `materialCare` VARCHAR(191) NULL,
    `disclaimer` VARCHAR(191) NULL,
    `showMaterialCare` BOOLEAN NOT NULL DEFAULT false,
    `gender` VARCHAR(191) NULL,
    `season` VARCHAR(191) NULL,
    `material` VARCHAR(191) NULL,
    `occasion` VARCHAR(191) NULL,
    `fitType` VARCHAR(191) NULL,
    `pattern` VARCHAR(191) NULL,
    `sleeveStyle` VARCHAR(191) NULL,
    `neckStyle` VARCHAR(191) NULL,
    `washCare` VARCHAR(191) NULL,
    `tags` JSON NULL,
    `sku` VARCHAR(191) NULL,
    `barcode` VARCHAR(191) NULL,
    `upc` VARCHAR(191) NULL,
    `ean` VARCHAR(191) NULL,
    `isbn` VARCHAR(191) NULL,
    `trackQuantity` BOOLEAN NOT NULL DEFAULT true,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `lowStockThreshold` INTEGER NOT NULL DEFAULT 5,
    `allowBackorder` BOOLEAN NOT NULL DEFAULT false,
    `manageStock` BOOLEAN NOT NULL DEFAULT true,
    `price` DOUBLE NOT NULL DEFAULT 0,
    `originalPrice` DOUBLE NULL,
    `costPrice` DOUBLE NULL,
    `discountPercent` DOUBLE NULL,
    `weight` DOUBLE NULL,
    `weightUnit` VARCHAR(191) NOT NULL DEFAULT 'kg',
    `dimensions` JSON NULL,
    `images` JSON NULL,
    `videos` JSON NULL,
    `thumbnail` VARCHAR(191) NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` VARCHAR(191) NULL,
    `seoKeywords` JSON NULL,
    `canonicalUrl` VARCHAR(191) NULL,
    `robotsMeta` VARCHAR(191) NULL DEFAULT 'index,follow',
    `seoFriendlyImageFilename` VARCHAR(191) NULL,
    `imageAltText` VARCHAR(191) NULL,
    `productSchema` JSON NULL,
    `brandSchema` JSON NULL,
    `breadcrumbSchema` JSON NULL,
    `itemListSchema` JSON NULL,
    `faqSchema` JSON NULL,
    `ogTitle` VARCHAR(191) NULL,
    `ogDescription` VARCHAR(191) NULL,
    `ogImage` VARCHAR(191) NULL,
    `twitterCardMeta` JSON NULL,
    `productDescription` VARCHAR(191) NULL,
    `faqs` JSON NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isDigital` BOOLEAN NOT NULL DEFAULT false,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `isNew` BOOLEAN NOT NULL DEFAULT false,
    `isOnSale` BOOLEAN NOT NULL DEFAULT false,
    `isBestSeller` BOOLEAN NOT NULL DEFAULT false,
    `isSales` BOOLEAN NOT NULL DEFAULT false,
    `isNewSeller` BOOLEAN NOT NULL DEFAULT false,
    `isFestivalOffer` BOOLEAN NOT NULL DEFAULT false,
    `visibility` VARCHAR(191) NOT NULL DEFAULT 'VISIBLE',
    `publishedAt` DATETIME(3) NULL,
    `requiresShipping` BOOLEAN NOT NULL DEFAULT true,
    `shippingClass` VARCHAR(191) NULL,
    `freeShipping` BOOLEAN NOT NULL DEFAULT false,
    `taxable` BOOLEAN NOT NULL DEFAULT true,
    `taxClass` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `subCategoryId` VARCHAR(191) NULL,
    `brandId` VARCHAR(191) NULL,
    `customFields` JSON NULL,
    `notes` VARCHAR(191) NULL,
    `isVariant` BOOLEAN NOT NULL DEFAULT false,
    `variantAttributes` JSON NULL,
    `selectedSizes` JSON NULL,
    `selectedColors` JSON NULL,
    `variants` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_slug_key`(`slug`),
    INDEX `products_categoryId_isActive_idx`(`categoryId`, `isActive`),
    INDEX `products_brandId_isActive_idx`(`brandId`, `isActive`),
    INDEX `products_isFeatured_isActive_idx`(`isFeatured`, `isActive`),
    INDEX `products_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    INDEX `products_isDigital_isActive_idx`(`isDigital`, `isActive`),
    INDEX `products_isOnSale_isActive_idx`(`isOnSale`, `isActive`),
    INDEX `products_visibility_isActive_idx`(`visibility`, `isActive`),
    INDEX `products_isBestSeller_isActive_idx`(`isBestSeller`, `isActive`),
    INDEX `products_isNew_isActive_idx`(`isNew`, `isActive`),
    INDEX `products_categoryId_isFeatured_isActive_idx`(`categoryId`, `isFeatured`, `isActive`),
    INDEX `products_name_idx`(`name`),
    INDEX `products_publishedAt_isActive_idx`(`publishedAt`, `isActive`),
    INDEX `products_quantity_isActive_idx`(`quantity`, `isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `brands_name_key`(`name`),
    UNIQUE INDEX `brands_slug_key`(`slug`),
    INDEX `brands_isActive_idx`(`isActive`),
    INDEX `brands_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `subtotal` DOUBLE NOT NULL,
    `tax` DOUBLE NOT NULL DEFAULT 0,
    `shipping` DOUBLE NOT NULL DEFAULT 0,
    `total` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `shippingName` VARCHAR(191) NOT NULL,
    `shippingEmail` VARCHAR(191) NOT NULL,
    `shippingPhone` VARCHAR(191) NULL,
    `shippingAddress` VARCHAR(191) NOT NULL,
    `shippingCity` VARCHAR(191) NOT NULL,
    `shippingState` VARCHAR(191) NULL,
    `shippingCountry` VARCHAR(191) NOT NULL,
    `shippingZip` VARCHAR(191) NOT NULL,
    `billingName` VARCHAR(191) NULL,
    `billingEmail` VARCHAR(191) NULL,
    `billingPhone` VARCHAR(191) NULL,
    `billingAddress` VARCHAR(191) NULL,
    `billingCity` VARCHAR(191) NULL,
    `billingState` VARCHAR(191) NULL,
    `billingCountry` VARCHAR(191) NULL,
    `billingZip` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `adminNotes` VARCHAR(191) NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `paymentStatus` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_orderNumber_key`(`orderNumber`),
    INDEX `orders_userId_status_idx`(`userId`, `status`),
    INDEX `orders_userId_createdAt_idx`(`userId`, `createdAt` DESC),
    INDEX `orders_status_createdAt_idx`(`status`, `createdAt` DESC),
    INDEX `orders_createdAt_idx`(`createdAt` DESC),
    INDEX `orders_paymentStatus_idx`(`paymentStatus`),
    INDEX `orders_orderNumber_idx`(`orderNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `order_items_orderId_idx`(`orderId`),
    INDEX `order_items_productId_idx`(`productId`),
    INDEX `order_items_productId_orderId_idx`(`productId`, `orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `carts_sessionId_key`(`sessionId`),
    INDEX `carts_userId_idx`(`userId`),
    INDEX `carts_userId_updatedAt_idx`(`userId`, `updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_items` (
    `id` VARCHAR(191) NOT NULL,
    `cartId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `size` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `cart_items_cartId_idx`(`cartId`),
    INDEX `cart_items_productId_idx`(`productId`),
    UNIQUE INDEX `cart_items_cartId_productId_size_color_key`(`cartId`, `productId`, `size`, `color`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reward_settings` (
    `id` VARCHAR(191) NOT NULL,
    `amountUnit` DOUBLE NOT NULL DEFAULT 100,
    `rewardValue` INTEGER NOT NULL DEFAULT 1,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reward_settings_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `color_settings` (
    `id` VARCHAR(191) NOT NULL,
    `primaryColor` VARCHAR(191) NOT NULL DEFAULT '#D4AF37',
    `secondaryColor` VARCHAR(191) NOT NULL DEFAULT '#10B981',
    `accentColor` VARCHAR(191) NOT NULL DEFAULT '#F59E0B',
    `backgroundColor` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF',
    `textColor` VARCHAR(191) NOT NULL DEFAULT '#1F2937',
    `buttonPrimaryBg` VARCHAR(191) NOT NULL DEFAULT '#D4AF37',
    `buttonPrimaryText` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF',
    `buttonSecondaryBg` VARCHAR(191) NOT NULL DEFAULT '#F3F4F6',
    `buttonSecondaryText` VARCHAR(191) NOT NULL DEFAULT '#1F2937',
    `bannerBackgroundColor` VARCHAR(191) NOT NULL DEFAULT '#F9FAFB',
    `bannerTextColor` VARCHAR(191) NOT NULL DEFAULT '#1F2937',
    `cardBackgroundColor` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF',
    `cardBorderColor` VARCHAR(191) NOT NULL DEFAULT '#E5E7EB',
    `headerBackgroundColor` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF',
    `footerBackgroundColor` VARCHAR(191) NOT NULL DEFAULT '#1F2937',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `color_settings_createdAt_idx`(`createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_rewards` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `points` INTEGER NOT NULL,
    `type` ENUM('EARNED', 'REDEEMED') NOT NULL DEFAULT 'EARNED',
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `user_rewards_userId_isActive_idx`(`userId`, `isActive`),
    INDEX `user_rewards_userId_type_createdAt_idx`(`userId`, `type`, `createdAt` DESC),
    INDEX `user_rewards_orderId_idx`(`orderId`),
    INDEX `user_rewards_type_isActive_createdAt_idx`(`type`, `isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `navigation_items` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `navigation_items_isActive_order_idx`(`isActive`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `navigation_columns` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL DEFAULT '',
    `order` INTEGER NOT NULL DEFAULT 0,
    `navigationItemId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `navigation_columns_navigationItemId_order_idx`(`navigationItemId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `navigation_links` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `columnId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `navigation_links_columnId_order_idx`(`columnId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_by_categories` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `shop_by_categories_isActive_order_idx`(`isActive`, `order`),
    INDEX `shop_by_categories_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_pages` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `content_pages_slug_key`(`slug`),
    INDEX `content_pages_isActive_idx`(`isActive`),
    INDEX `content_pages_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `footer_catalogs` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL DEFAULT '',
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `footer_catalogs_isActive_order_idx`(`isActive`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `footer_catalog_links` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `catalogId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `footer_catalog_links_catalogId_order_idx`(`catalogId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `footer_sections` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `footer_sections_isActive_order_idx`(`isActive`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `footer_section_links` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `href` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `sectionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `footer_section_links_sectionId_order_idx`(`sectionId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follow_sections` (
    `id` VARCHAR(191) NOT NULL,
    `brandName` VARCHAR(191) NOT NULL DEFAULT 'Rapharch',
    `street` VARCHAR(191) NOT NULL DEFAULT '123 Fashion Avenue',
    `city` VARCHAR(191) NOT NULL DEFAULT 'New York',
    `state` VARCHAR(191) NOT NULL DEFAULT 'NY',
    `zip` VARCHAR(191) NOT NULL DEFAULT '10001',
    `country` VARCHAR(191) NOT NULL DEFAULT 'United States',
    `copyrightText` VARCHAR(191) NOT NULL DEFAULT 'All rights reserved.',
    `designerCredit` VARCHAR(191) NOT NULL DEFAULT 'Designed by: M.A.P Tech Pvt. Ltd.',
    `showPaymentIcons` BOOLEAN NOT NULL DEFAULT true,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `follow_sections_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follow_service_items` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `followSectionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `follow_service_items_followSectionId_order_idx`(`followSectionId`, `order`),
    INDEX `follow_service_items_isActive_order_idx`(`isActive`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follow_social_links` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL DEFAULT 'Facebook',
    `ariaLabel` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `followSectionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `follow_social_links_followSectionId_order_idx`(`followSectionId`, `order`),
    INDEX `follow_social_links_isActive_order_idx`(`isActive`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sales_banners` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL,
    `buttonText` VARCHAR(191) NULL,
    `buttonUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `sales_banners_isActive_order_idx`(`isActive`, `order`),
    INDEX `sales_banners_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `json_ld_templates` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `page` VARCHAR(191) NOT NULL DEFAULT 'global',
    `schema` JSON NOT NULL,
    `variables` JSON NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `json_ld_templates_type_idx`(`type`),
    INDEX `json_ld_templates_page_isActive_priority_idx`(`page`, `isActive`, `priority`),
    INDEX `json_ld_templates_isActive_priority_idx`(`isActive`, `priority`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sitemap_config` (
    `id` VARCHAR(191) NOT NULL,
    `urls` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sitemap_config_createdAt_idx`(`createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `robots_config` (
    `id` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `robots_config_createdAt_idx`(`createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `editorial_sections` (
    `id` VARCHAR(191) NOT NULL,
    `season` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `ctaText` VARCHAR(191) NULL,
    `ctaLink` VARCHAR(191) NULL,
    `images` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `editorial_sections_isActive_order_idx`(`isActive`, `order`),
    INDEX `editorial_sections_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dual_card_sections` (
    `id` VARCHAR(191) NOT NULL,
    `cards` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `dual_card_sections_isActive_order_idx`(`isActive`, `order`),
    INDEX `dual_card_sections_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` VARCHAR(191) NOT NULL,
    `siteName` VARCHAR(191) NOT NULL DEFAULT 'Rapharch',
    `siteDescription` VARCHAR(191) NOT NULL DEFAULT 'Your trusted online shopping destination',
    `siteUrl` VARCHAR(191) NOT NULL DEFAULT 'https://rapharch.com',
    `siteLogo` VARCHAR(191) NULL,
    `siteFavicon` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL DEFAULT 'info@rapharch.com',
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'Nepal',
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NPR',
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'Asia/Kathmandu',
    `language` VARCHAR(191) NOT NULL DEFAULT 'en',
    `paymentMethods` JSON NOT NULL,
    `taxRate` DOUBLE NOT NULL DEFAULT 13,
    `shippingCost` DOUBLE NOT NULL DEFAULT 100,
    `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    `smsNotifications` BOOLEAN NOT NULL DEFAULT false,
    `pushNotifications` BOOLEAN NOT NULL DEFAULT true,
    `twoFactorAuth` BOOLEAN NOT NULL DEFAULT false,
    `sessionTimeout` INTEGER NOT NULL DEFAULT 30,
    `passwordPolicy` VARCHAR(191) NOT NULL DEFAULT 'strong',
    `lowStockThreshold` INTEGER NOT NULL DEFAULT 10,
    `autoReorder` BOOLEAN NOT NULL DEFAULT false,
    `trackInventory` BOOLEAN NOT NULL DEFAULT true,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` VARCHAR(191) NULL,
    `seoKeywords` VARCHAR(191) NULL,
    `ogTitle` VARCHAR(191) NULL,
    `ogDescription` VARCHAR(191) NULL,
    `ogImage` VARCHAR(191) NULL,
    `ogType` VARCHAR(191) NOT NULL DEFAULT 'website',
    `twitterCard` VARCHAR(191) NOT NULL DEFAULT 'summary_large_image',
    `twitterSite` VARCHAR(191) NULL,
    `googleAnalyticsId` VARCHAR(191) NULL,
    `facebookPixelId` VARCHAR(191) NULL,
    `conversionTracking` BOOLEAN NOT NULL DEFAULT false,
    `primaryColor` VARCHAR(191) NOT NULL DEFAULT '#D4AF37',
    `secondaryColor` VARCHAR(191) NOT NULL DEFAULT '#10B981',
    `accentColor` VARCHAR(191) NOT NULL DEFAULT '#F59E0B',
    `backgroundColor` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF',
    `textColor` VARCHAR(191) NOT NULL DEFAULT '#1F2937',
    `buttonPrimaryBg` VARCHAR(191) NOT NULL DEFAULT '#D4AF37',
    `buttonPrimaryText` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF',
    `buttonSecondaryBg` VARCHAR(191) NOT NULL DEFAULT '#F3F4F6',
    `buttonSecondaryText` VARCHAR(191) NOT NULL DEFAULT '#1F2937',
    `bannerBackgroundColor` VARCHAR(191) NOT NULL DEFAULT '#F0F9FF',
    `bannerTextColor` VARCHAR(191) NOT NULL DEFAULT '#1E40AF',
    `cardBackgroundColor` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF',
    `cardBorderColor` VARCHAR(191) NOT NULL DEFAULT '#E5E7EB',
    `headerBackgroundColor` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF',
    `footerBackgroundColor` VARCHAR(191) NOT NULL DEFAULT '#1F2937',
    `theme` VARCHAR(191) NOT NULL DEFAULT 'light',
    `defaultVariantImageWidth` INTEGER NOT NULL DEFAULT 800,
    `defaultVariantImageHeight` INTEGER NOT NULL DEFAULT 800,
    `variantAutoGeneration` BOOLEAN NOT NULL DEFAULT true,
    `allowVariantCombinations` BOOLEAN NOT NULL DEFAULT true,
    `showOutOfStockVariants` BOOLEAN NOT NULL DEFAULT false,
    `variantFallbackEnabled` BOOLEAN NOT NULL DEFAULT true,
    `variantAttributeTypes` VARCHAR(191) NOT NULL DEFAULT 'color,size,material',
    `googleAnalyticsMeasurementId` VARCHAR(191) NULL,
    `googleAnalyticsTrackingId` VARCHAR(191) NULL,
    `enhancedEcommerceEnabled` BOOLEAN NOT NULL DEFAULT false,
    `googleAdsEnabled` BOOLEAN NOT NULL DEFAULT false,
    `googleAdsConversionId` VARCHAR(191) NULL,
    `googleAdsConversionLabel` VARCHAR(191) NULL,
    `facebookConversionApiEnabled` BOOLEAN NOT NULL DEFAULT false,
    `facebookConversionApiToken` VARCHAR(191) NULL,
    `facebookPixelAdvancedMatching` BOOLEAN NOT NULL DEFAULT false,
    `customTrackingScripts` LONGTEXT NULL,
    `stripePublishableKey` VARCHAR(191) NULL,
    `stripeSecretKey` VARCHAR(191) NULL,
    `stripeWebhookSecret` VARCHAR(191) NULL,
    `bankApiKey` VARCHAR(191) NULL,
    `australiaPostApiKey` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `site_settings_createdAt_idx`(`createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `carts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_rewards` ADD CONSTRAINT `user_rewards_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_rewards` ADD CONSTRAINT `user_rewards_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `navigation_columns` ADD CONSTRAINT `navigation_columns_navigationItemId_fkey` FOREIGN KEY (`navigationItemId`) REFERENCES `navigation_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `navigation_links` ADD CONSTRAINT `navigation_links_columnId_fkey` FOREIGN KEY (`columnId`) REFERENCES `navigation_columns`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `footer_catalog_links` ADD CONSTRAINT `footer_catalog_links_catalogId_fkey` FOREIGN KEY (`catalogId`) REFERENCES `footer_catalogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `footer_section_links` ADD CONSTRAINT `footer_section_links_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `footer_sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follow_service_items` ADD CONSTRAINT `follow_service_items_followSectionId_fkey` FOREIGN KEY (`followSectionId`) REFERENCES `follow_sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follow_social_links` ADD CONSTRAINT `follow_social_links_followSectionId_fkey` FOREIGN KEY (`followSectionId`) REFERENCES `follow_sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

