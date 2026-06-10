-- CreateTable
CREATE TABLE `coupons` (
    `id` VARCHAR(36) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'percentage',
    `value` DOUBLE NOT NULL,
    `minOrderAmount` DOUBLE NULL,
    `maxDiscountAmount` DOUBLE NULL,
    `usageLimit` INTEGER NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `applicableTo` VARCHAR(191) NOT NULL DEFAULT 'all',
    `applicableItems` JSON NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `coupons_code_key`(`code`),
    INDEX `coupons_code_isActive_idx`(`code`, `isActive`),
    INDEX `coupons_isActive_startDate_endDate_idx`(`isActive`, `startDate`, `endDate`),
    INDEX `coupons_isActive_createdAt_idx`(`isActive`, `createdAt` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
