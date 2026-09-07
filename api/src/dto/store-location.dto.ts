import { z } from 'zod';

const optionalStr = (max: number) =>
  z.preprocess(
    (v) => (v === '' || v === null ? undefined : v),
    z.string().max(max).optional(),
  );

export const storeLocationCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(200),
  state: z.string().min(1).max(200),
  zip: z.string().min(1).max(50),
  country: optionalStr(200),
  phone: optionalStr(50),
  email: z.preprocess(
    (v) => (v === '' || v === null ? undefined : v),
    z.string().email().max(255).optional(),
  ),
  image: optionalStr(500),
  mapEmbedUrl: optionalStr(1000),
  hours: z.any().optional(),
  features: z.any().optional(),
  isActive: z.preprocess(
    (v) => (v === undefined ? true : v),
    z.boolean(),
  ),
  order: z.preprocess(
    (v) => (v === undefined || v === '' ? 0 : v),
    z.number().int().min(0),
  ),
});

export const storeLocationUpdateSchema = z.object({
  name: optionalStr(200),
  slug: optionalStr(200),
  address: optionalStr(500),
  city: optionalStr(200),
  state: optionalStr(200),
  zip: optionalStr(50),
  country: optionalStr(200),
  phone: optionalStr(50),
  email: z.preprocess(
    (v) => (v === '' || v === null ? undefined : v),
    z.string().email().max(255).optional(),
  ),
  image: optionalStr(500),
  mapEmbedUrl: optionalStr(1000),
  hours: z.any().optional(),
  features: z.any().optional(),
  isActive: z.preprocess(
    (v) => (v === undefined ? undefined : v),
    z.boolean().optional(),
  ),
  order: z.preprocess(
    (v) => (v === undefined || v === '' ? undefined : v),
    z.number().int().min(0).optional(),
  ),
});

export type StoreLocationCreateDTO = z.infer<typeof storeLocationCreateSchema>;
export type StoreLocationUpdateDTO = z.infer<typeof storeLocationUpdateSchema>;
