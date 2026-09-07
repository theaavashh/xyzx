-- CreateTable
CREATE TABLE "women_items_config" (
    "id" VARCHAR(191) NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "buttonTitle" VARCHAR(191) NOT NULL,
    "buttonCta" VARCHAR(191) NOT NULL,
    "filterType" VARCHAR(191) NOT NULL DEFAULT 'gender',
    "filterValue" VARCHAR(191) NOT NULL DEFAULT 'Women',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "women_items_config_pkey" PRIMARY KEY ("id")
);
