#!/bin/sh
set -e

echo "[entrypoint] Ensuring uploads directory is writable..."
mkdir -p /app/uploads/{herobanner,store,category,hero-slide,category-grid,image-grid,featured-section,sales-banner,editorial,dual-card,follow-section,products,general,three-image-grid}
chown -R nodejs:nodejs /app/uploads

echo "[entrypoint] Dropping all foreign keys so db push can freely reconcile primary keys (db push recreates them from schema)..."
su-exec nodejs tsx src/scripts/drop-foreign-keys.ts

echo "[entrypoint] Applying schema to database (migrate deploy is broken: migrations use PostgreSQL syntax on a MySQL DB)..."
su-exec nodejs prisma db push --accept-data-loss --skip-generate

# Add position column to hero_banners if missing
echo "[entrypoint] Ensuring hero_banners.position column exists..."
su-exec nodejs prisma db execute --stdin <<'POSITION_SQL'
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'hero_banners' AND COLUMN_NAME = 'position');
SET @sql = IF(@col_exists = 0, "ALTER TABLE `hero_banners` ADD COLUMN `position` VARCHAR(191) NULL DEFAULT 'CENTER'", 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
POSITION_SQL

su-exec nodejs prisma db execute --stdin <<'MIGRATION_SQL'
-- CreateTable (skip if exists)
CREATE TABLE IF NOT EXISTS `promotional_banners` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL,
    `textColor` VARCHAR(191) NOT NULL DEFAULT '#ffffff',
    `link` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    INDEX `promotional_banners_isActive_order_idx`(`isActive`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `feature_configs` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    INDEX `feature_configs_isActive_order_idx`(`isActive`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `three_image_grid_sections` (
    `id` VARCHAR(36) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    INDEX `three_image_grid_sections_isActive_order_idx`(`isActive`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `three_image_grid_columns` (
    `id` VARCHAR(36) NOT NULL,
    `imageSrc` VARCHAR(191) NOT NULL,
    `imageAlt` VARCHAR(191) NOT NULL,
    `imageLink` VARCHAR(191) NULL,
    `productName` VARCHAR(191) NULL,
    `productPrice` DOUBLE NULL,
    `productOriginalPrice` DOUBLE NULL,
    `productImage` VARCHAR(191) NULL,
    `productLink` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `sectionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    INDEX `three_image_grid_columns_sectionId_order_idx`(`sectionId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey (ignore if already exists)
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'three_image_grid_columns' AND CONSTRAINT_NAME = 'three_image_grid_columns_sectionId_fkey');
SET @sql = IF(@fk_exists = 0, 'ALTER TABLE `three_image_grid_columns` ADD CONSTRAINT `three_image_grid_columns_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `three_image_grid_sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
MIGRATION_SQL

# Create category_tile_grid tables (skip if exists)
echo "[entrypoint] Ensuring category_tile_grid tables exist..."
su-exec nodejs prisma db execute --stdin <<'CATEGORY_TILE_GRID_SQL'
CREATE TABLE IF NOT EXISTS `category_tile_grid_sections` (
    `id` VARCHAR(36) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    INDEX `category_tile_grid_sections_isActive_order_idx`(`isActive`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `category_tile_grid_items` (
    `id` VARCHAR(36) NOT NULL,
    `imageSrc` VARCHAR(191) NOT NULL,
    `imageAlt` VARCHAR(191) NOT NULL,
    `imageLink` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `subtitle` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `sectionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    INDEX `category_tile_grid_items_sectionId_order_idx`(`sectionId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'category_tile_grid_items' AND CONSTRAINT_NAME = 'category_tile_grid_items_sectionId_fkey');
SET @sql = IF(@fk_exists = 0, 'ALTER TABLE `category_tile_grid_items` ADD CONSTRAINT `category_tile_grid_items_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `category_tile_grid_sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
CATEGORY_TILE_GRID_SQL

echo "[entrypoint] Auto-creating admin user..."
su-exec nodejs tsx src/scripts/auto-create-admin.ts

echo "[entrypoint] Starting application..."
exec su-exec nodejs node dist/index.js
