-- CreateTable
CREATE TABLE "footer_sections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "footer_section_links" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "sectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "footer_section_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow_sections" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL DEFAULT 'Rapharch',
    "street" TEXT NOT NULL DEFAULT '123 Fashion Avenue',
    "city" TEXT NOT NULL DEFAULT 'New York',
    "state" TEXT NOT NULL DEFAULT 'NY',
    "zip" TEXT NOT NULL DEFAULT '10001',
    "country" TEXT NOT NULL DEFAULT 'United States',
    "copyrightText" TEXT NOT NULL DEFAULT 'All rights reserved.',
    "designerCredit" TEXT NOT NULL DEFAULT 'Designed by: M.A.P Tech Pvt. Ltd.',
    "showPaymentIcons" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follow_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow_service_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "followSectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follow_service_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow_social_links" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Facebook',
    "ariaLabel" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "followSectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follow_social_links_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "footer_section_links" ADD CONSTRAINT "footer_section_links_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "footer_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_service_items" ADD CONSTRAINT "follow_service_items_followSectionId_fkey" FOREIGN KEY ("followSectionId") REFERENCES "follow_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_social_links" ADD CONSTRAINT "follow_social_links_followSectionId_fkey" FOREIGN KEY ("followSectionId") REFERENCES "follow_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
