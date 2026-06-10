/*
  Warnings:

  - The `customFields` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `selectedColors` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `variants` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "customFields",
ADD COLUMN     "customFields" JSONB,
DROP COLUMN "selectedColors",
ADD COLUMN     "selectedColors" JSONB,
DROP COLUMN "variants",
ADD COLUMN     "variants" JSONB;
