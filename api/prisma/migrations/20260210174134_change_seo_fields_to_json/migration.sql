/*
  Warnings:

  - The `productSchema` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `brandSchema` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `breadcrumbSchema` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemListSchema` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `faqSchema` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `twitterCardMeta` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `faqs` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "productSchema",
ADD COLUMN     "productSchema" JSONB,
DROP COLUMN "brandSchema",
ADD COLUMN     "brandSchema" JSONB,
DROP COLUMN "breadcrumbSchema",
ADD COLUMN     "breadcrumbSchema" JSONB,
DROP COLUMN "itemListSchema",
ADD COLUMN     "itemListSchema" JSONB,
DROP COLUMN "faqSchema",
ADD COLUMN     "faqSchema" JSONB,
DROP COLUMN "twitterCardMeta",
ADD COLUMN     "twitterCardMeta" JSONB,
DROP COLUMN "faqs",
ADD COLUMN     "faqs" JSONB;
