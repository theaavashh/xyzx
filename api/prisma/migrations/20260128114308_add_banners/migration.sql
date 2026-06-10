/*
  Warnings:

  - You are about to drop the column `endDate` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `linkUrl` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "banners" DROP COLUMN "endDate",
DROP COLUMN "imageUrl",
DROP COLUMN "linkUrl",
DROP COLUMN "startDate",
DROP COLUMN "subtitle";
