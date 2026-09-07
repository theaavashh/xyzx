-- CreateTable
CREATE TABLE "store_locations" (
    "id" VARCHAR(191) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "address" VARCHAR(500) NOT NULL,
    "city" VARCHAR(200) NOT NULL,
    "state" VARCHAR(200) NOT NULL,
    "zip" VARCHAR(50) NOT NULL,
    "country" VARCHAR(200) NOT NULL DEFAULT 'United States',
    "phone" VARCHAR(50),
    "email" VARCHAR(255),
    "image" VARCHAR(500),
    "mapEmbedUrl" VARCHAR(1000),
    "hours" JSON NOT NULL DEFAULT ('[]'),
    "features" JSON NOT NULL DEFAULT ('[]'),
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_locations_slug_key" ON "store_locations"("slug");

-- CreateIndex
CREATE INDEX "store_locations_isActive_idx" ON "store_locations"("isActive");
