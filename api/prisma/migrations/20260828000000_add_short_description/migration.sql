-- CreateTable
CREATE TABLE "short_descriptions" (
    "id" VARCHAR(191) NOT NULL,
    "description" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "short_descriptions_pkey" PRIMARY KEY ("id")
);
