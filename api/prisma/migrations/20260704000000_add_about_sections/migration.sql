-- CreateTable
CREATE TABLE "about_sections" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL DEFAULT 'More About Us',
    "ctaUrl" TEXT NOT NULL DEFAULT '/about',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "about_sections_isActive_order_idx" ON "about_sections"("isActive", "order");
