import { z } from 'zod';

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema);

const optionalStr = (max: number) =>
  z.preprocess(
    (v) => (v === '' || v === null ? undefined : v),
    z.string().max(max).optional(),
  );

export const aboutSectionCreateSchema = z.object({
  quote: z.string().min(1).max(1000),
  ctaText: optionalStr(200),
  ctaUrl: optionalStr(500),
  heroImage: optionalStr(500),
  heroSubtitle: optionalStr(1000),
  heroTagline: optionalStr(500),
  storyTitle: optionalStr(500),
  storyContent: optionalStr(500000),
  storyImage: optionalStr(500),
  pullQuote: optionalStr(1000),
  videoUrl: optionalStr(500),
  videoOverlayText: optionalStr(500),
  bannerImage: optionalStr(500),
  bannerText: optionalStr(500),
  storeDescription: optionalStr(1000),
  storeAddress: optionalStr(500),
  storeCity: optionalStr(200),
  storeState: optionalStr(200),
  storeZip: optionalStr(50),
  storePhone: optionalStr(50),
  storeEmail: optionalStr(200),
  metaTitle: optionalStr(300),
  metaDescription: optionalStr(500),
  isActive: z.preprocess(
    (v) => (v === undefined ? true : v),
    z.boolean(),
  ),
  order: z.preprocess(
    (v) => (v === undefined || v === '' ? 0 : v),
    z.number().int().min(0),
  ),
});

export const aboutSectionUpdateSchema = z.object({
  quote: optionalStr(1000),
  ctaText: optionalStr(200),
  ctaUrl: optionalStr(500),
  heroImage: optionalStr(500),
  heroSubtitle: optionalStr(1000),
  heroTagline: optionalStr(500),
  storyTitle: optionalStr(500),
  storyContent: optionalStr(500000),
  storyImage: optionalStr(500),
  pullQuote: optionalStr(1000),
  videoUrl: optionalStr(500),
  videoOverlayText: optionalStr(500),
  bannerImage: optionalStr(500),
  bannerText: optionalStr(500),
  storeDescription: optionalStr(1000),
  storeAddress: optionalStr(500),
  storeCity: optionalStr(200),
  storeState: optionalStr(200),
  storeZip: optionalStr(50),
  storePhone: optionalStr(50),
  storeEmail: optionalStr(200),
  metaTitle: optionalStr(300),
  metaDescription: optionalStr(500),
  isActive: z.preprocess(
    (v) => (v === undefined ? undefined : v),
    z.boolean().optional(),
  ),
  order: z.preprocess(
    (v) => (v === undefined || v === '' ? undefined : v),
    z.number().int().min(0).optional(),
  ),
});

export type AboutSectionCreateDTO = z.infer<typeof aboutSectionCreateSchema>;
export type AboutSectionUpdateDTO = z.infer<typeof aboutSectionUpdateSchema>;
