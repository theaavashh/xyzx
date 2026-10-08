import type { HeroSlide, Prisma } from '@prisma/client';

export interface IHeroSlideRepository {
  findActiveHeroSlides(): Promise<HeroSlide[]>;

  findAllHeroSlides(): Promise<HeroSlide[]>;

  findHeroSlideById(id: string): Promise<HeroSlide | null>;

  createHeroSlide(data: Prisma.HeroSlideCreateInput): Promise<HeroSlide>;

  updateHeroSlide(id: string, data: Prisma.HeroSlideUpdateInput): Promise<HeroSlide>;

  deleteHeroSlide(id: string): Promise<void>;

  existsById(id: string): Promise<boolean>;

  toggleHeroSlideStatus(id: string): Promise<HeroSlide>;

  reorderHeroSlides(orders: Array<{ id: string; order: number }>): Promise<void>;
}

export const HERO_SLIDE_REPOSITORY_TOKEN = 'HERO_SLIDE_REPOSITORY';