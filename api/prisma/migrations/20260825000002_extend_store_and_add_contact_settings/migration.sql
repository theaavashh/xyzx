-- AlterTable: extend store_sections with page header fields
ALTER TABLE `store_sections`
  ADD COLUMN `pageTitle` VARCHAR(200) NULL DEFAULT 'VISIT US',
  ADD COLUMN `pageDescription` TEXT NULL;

-- CreateTable: contact_page_settings
CREATE TABLE `contact_page_settings` (
  `id` VARCHAR(36) NOT NULL,
  `pageTitle` VARCHAR(200) NULL DEFAULT 'GET IN TOUCH WITH US',
  `pageSubtitle` VARCHAR(500) NULL,
  `email` VARCHAR(200) NULL DEFAULT 'support@rapharch.com',
  `phone` VARCHAR(50) NULL DEFAULT '+1 (212) 555-0189',
  `subjectOptions` VARCHAR(1000) NULL DEFAULT 'order,product,shipping,return,technical,other',
  `successTitle` VARCHAR(200) NULL DEFAULT 'Message Sent!',
  `successMessage` VARCHAR(1000) NULL DEFAULT 'Thank you for reaching out. Our team will get back to you within 48 hours.',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
