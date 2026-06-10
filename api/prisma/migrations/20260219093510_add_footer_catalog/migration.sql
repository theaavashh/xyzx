-- CreateTable
CREATE TABLE "footer_catalogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "href" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_catalog_links" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "catalogId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_catalog_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "footer_catalog_links" ADD CONSTRAINT "footer_catalog_links_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "footer_catalogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
