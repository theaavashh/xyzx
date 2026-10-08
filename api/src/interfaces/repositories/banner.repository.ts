import type { Banner, Prisma } from '@prisma/client';

export interface BannerFilters {
  search?: string;
  isActive?: boolean;
  position?: string;
}

export interface BannerSortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface IBannerRepository {
  findBanners(
    page: number,
    limit: number,
    filters?: BannerFilters,
    sortOptions?: BannerSortOptions
  ): Promise<PaginatedResult<Banner>>;

  findActiveBanners(position?: string): Promise<Banner[]>;

  findBannerById(id: string): Promise<Banner | null>;

  createBanner(data: Prisma.BannerCreateInput): Promise<Banner>;

  updateBanner(id: string, data: Prisma.BannerUpdateInput): Promise<Banner>;

  deleteBanner(id: string): Promise<void>;

  existsById(id: string): Promise<boolean>;

  toggleBannerStatus(id: string): Promise<Banner>;
}

export const BANNER_REPOSITORY_TOKEN = 'BANNER_REPOSITORY';