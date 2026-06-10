-- CreateTable
CREATE TABLE "json_ld_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "page" TEXT NOT NULL DEFAULT 'global',
    "schema" JSONB NOT NULL,
    "variables" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "json_ld_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "json_ld_templates_type_idx" ON "json_ld_templates"("type");

-- CreateIndex
CREATE INDEX "json_ld_templates_page_idx" ON "json_ld_templates"("page");

-- CreateIndex
CREATE INDEX "json_ld_templates_isActive_idx" ON "json_ld_templates"("isActive");

-- CreateIndex
CREATE INDEX "brands_isActive_idx" ON "brands"("isActive");

-- CreateIndex
CREATE INDEX "brands_slug_idx" ON "brands"("slug");

-- CreateIndex
CREATE INDEX "categories_isActive_idx" ON "categories"("isActive");

-- CreateIndex
CREATE INDEX "categories_parentId_isActive_idx" ON "categories"("parentId", "isActive");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "orders_userId_status_idx" ON "orders"("userId", "status");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");

-- CreateIndex
CREATE INDEX "products_categoryId_isActive_idx" ON "products"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE INDEX "products_isFeatured_isActive_idx" ON "products"("isFeatured", "isActive");

-- CreateIndex
CREATE INDEX "products_isActive_createdAt_idx" ON "products"("isActive", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "products_isDigital_isActive_idx" ON "products"("isDigital", "isActive");

-- CreateIndex
CREATE INDEX "products_isOnSale_isActive_idx" ON "products"("isOnSale", "isActive");

-- CreateIndex
CREATE INDEX "products_visibility_isActive_idx" ON "products"("visibility", "isActive");

-- CreateIndex
CREATE INDEX "products_slug_idx" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_sku_idx" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_categoryId_isFeatured_isActive_idx" ON "products"("categoryId", "isFeatured", "isActive");

-- CreateIndex
CREATE INDEX "reward_settings_isActive_idx" ON "reward_settings"("isActive");

-- CreateIndex
CREATE INDEX "user_rewards_userId_isActive_idx" ON "user_rewards"("userId", "isActive");

-- CreateIndex
CREATE INDEX "user_rewards_orderId_idx" ON "user_rewards"("orderId");

-- CreateIndex
CREATE INDEX "user_rewards_type_createdAt_idx" ON "user_rewards"("type", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "users_role_isActive_idx" ON "users"("role", "isActive");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");
