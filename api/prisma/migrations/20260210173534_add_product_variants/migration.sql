-- AlterTable
ALTER TABLE "products" ADD COLUMN     "isVariant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "selectedColors" TEXT,
ADD COLUMN     "selectedSizes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "variantAttributes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "variants" TEXT;
