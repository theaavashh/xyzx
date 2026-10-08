import type { Prisma, PrismaClient, Product } from '@prisma/client';
import { IProductRepository, ProductFilters, ProductSortOptions, PaginatedResult, ProductWithCategory, PRODUCT_REPOSITORY_TOKEN } from '../interfaces/repositories/product.repository.js';
import { ICacheService } from '../interfaces/services/cache.service.js';

const CACHE_PREFIX = 'product';

const selectCategory = { select: { id: true, name: true, slug: true } };

const getCacheKey = (key: string): string => `${CACHE_PREFIX}:${key}`;

const buildWhereClause = (
  filters: ProductFilters,
): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {};

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    where.OR = [
      { name: { contains: searchLower } },
      { description: { contains: searchLower } },
      { sku: { contains: searchLower } },
    ];
  }
  if (filters.slug) where.slug = filters.slug;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }
  if (filters.isActive !== undefined) where.isActive = filters.isActive;
  if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
  if (filters.isNew !== undefined) where.isNew = filters.isNew;
  if (filters.isOnSale !== undefined) where.isOnSale = filters.isOnSale;
  if (filters.isBestSeller !== undefined) where.isBestSeller = filters.isBestSeller;
  if (filters.isNewSeller !== undefined) where.isNewSeller = filters.isNewSeller;
  if (filters.isFestivalOffer !== undefined) where.isFestivalOffer = filters.isFestivalOffer;
  if (filters.isDigital !== undefined) where.isDigital = filters.isDigital;
  if (filters.brandId) where.brandId = filters.brandId;
  if (filters.gender) where.gender = filters.gender;

  return where;
};

const buildOrderByClause = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): Prisma.ProductOrderByWithRelationInput => {
  const validSortFields = ['createdAt', 'updatedAt', 'name', 'price'];
  const field = validSortFields.includes(sortBy ?? '') ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  return { [field!]: order };
};

export const createProductRepository = (prisma: PrismaClient, cacheService: ICacheService): IProductRepository => {
  const invalidateCache = async (id?: string, slug?: string): Promise<void> => {
    await cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`);
    if (id) await cacheService.delete(getCacheKey(`id:${id}`));
    if (slug) await cacheService.delete(getCacheKey(`slug:${slug}`));
  };

  const findProducts = async (
    page: number,
    limit: number,
    filters: ProductFilters,
    sortOptions: ProductSortOptions,
  ): Promise<PaginatedResult<ProductWithCategory>> => {
    const cacheKey = getCacheKey(
      `list:${page}:${limit}:${JSON.stringify(filters)}:${JSON.stringify(sortOptions)}`,
    );

    return cacheService.getOrSet(cacheKey, async () => {
      const where = buildWhereClause(filters);
      const orderBy = buildOrderByClause(sortOptions.sortBy, sortOptions.sortOrder);
      const skip = (page - 1) * limit;

      const [idRows, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          select: { id: true },
        }),
        prisma.product.count({ where }),
      ]);

      if (idRows.length === 0) {
        return {
          data: [],
          pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
      }

      const orderedIds = idRows.map((row) => row.id);
      const data = await prisma.product.findMany({
        where: { id: { in: orderedIds } },
        include: { category: selectCategory },
      });
      const dataById = new Map(data.map((product) => [product.id, product]));
      const orderedData = orderedIds
        .map((id) => dataById.get(id))
        .filter((product): product is ProductWithCategory => Boolean(product));

      return {
        data: orderedData,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      };
    });
  };

  const findProductById = async (
    id: string,
  ): Promise<ProductWithCategory | null> => {
    const cacheKey = getCacheKey(`id:${id}`);
    return cacheService.getOrSet(cacheKey, async () => {
      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: selectCategory },
      });
      return product as ProductWithCategory | null;
    });
  };

  const findProductBySlug = async (
    slug: string,
  ): Promise<ProductWithCategory | null> => {
    const cacheKey = getCacheKey(`slug:${slug}`);
    return cacheService.getOrSet(cacheKey, async () => {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: selectCategory },
      });
      return product as ProductWithCategory | null;
    });
  };

  const createProduct = async (
    data: Prisma.ProductCreateInput,
  ): Promise<ProductWithCategory> => {
    const product = await prisma.product.create({
      data,
      include: { category: selectCategory },
    });
    await cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`);
    return product as ProductWithCategory;
  };

  const updateProduct = async (
    id: string,
    data: Prisma.ProductUpdateInput,
  ): Promise<ProductWithCategory> => {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: selectCategory },
    });
    await Promise.all([
      cacheService.delete(getCacheKey(`id:${id}`)),
      cacheService.delete(getCacheKey(`slug:${product.slug}`)),
      cacheService.invalidatePattern(`${CACHE_PREFIX}:list*`),
    ]);
    return product as ProductWithCategory;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });
    await prisma.product.delete({ where: { id } });
    await Promise.all([
      cacheService.delete(getCacheKey(`id:${id}`)),
      product && cacheService.delete(getCacheKey(`slug:${product.slug}`)),
      cacheService.invalidatePattern(`${CACHE_PREFIX}:*`),
    ]);
  };

  const bulkDeleteProducts = async (ids: string[]): Promise<number> => {
    const result = await prisma.product.deleteMany({
      where: { id: { in: ids } },
    });
    await cacheService.invalidatePattern(`${CACHE_PREFIX}:*`);
    return result.count;
  };

  const existsBySlug = async (slug: string): Promise<boolean> => {
    const count = await prisma.product.count({ where: { slug } });
    return count > 0;
  };

  const existsById = async (id: string): Promise<boolean> => {
    const count = await prisma.product.count({ where: { id } });
    return count > 0;
  };

  return {
    findProducts,
    findProductById,
    findProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    existsBySlug,
    existsById,
  };
};

export { PRODUCT_REPOSITORY_TOKEN };