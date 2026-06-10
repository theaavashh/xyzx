/*
  Warnings:

  - You are about to drop the column `additionalDetails` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `disclaimer` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `ingredients` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `showAdditionalDetails` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `showDisclaimer` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `showIngredients` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "additionalDetails",
DROP COLUMN "disclaimer",
DROP COLUMN "ingredients",
DROP COLUMN "showAdditionalDetails",
DROP COLUMN "showDisclaimer",
DROP COLUMN "showIngredients";

-- CreateTable
CREATE TABLE "hero_banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "largeImage" TEXT,
    "smallImage" TEXT,
    "buttonUrl" TEXT,
    "buttonText" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_banners_pkey" PRIMARY KEY ("id")
);
