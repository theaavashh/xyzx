-- CreateTable
CREATE TABLE `category_grid_items` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL,
    `imageMobile` VARCHAR(191) NULL,
    `link` VARCHAR(191) NOT NULL,
    `alt` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `category_grid_items_isActive_order_idx`(`isActive`, `order`),
    INDEX `category_grid_items_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
