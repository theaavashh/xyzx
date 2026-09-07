-- AlterTable: Make userId nullable on orders table
ALTER TABLE `orders` MODIFY COLUMN `userId` VARCHAR(191) NULL;
