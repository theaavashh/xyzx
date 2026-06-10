/*
  Warnings:

  - You are about to drop the column `description` on the `hero_banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hero_banners" DROP COLUMN "description";

-- CreateTable
CREATE TABLE "navigation_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_columns" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "navigationItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_columns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_links" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "columnId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "navigation_columns" ADD CONSTRAINT "navigation_columns_navigationItemId_fkey" FOREIGN KEY ("navigationItemId") REFERENCES "navigation_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_links" ADD CONSTRAINT "navigation_links_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "navigation_columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
