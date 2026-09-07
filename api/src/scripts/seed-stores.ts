import { prisma } from '../lib/database';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

interface SeedStore {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  image: string;
  mapEmbedUrl: string;
  hours: { days: string; hours: string }[];
  features: string[];
  isActive: boolean;
  order: number;
}

async function seedStores() {
  const jsonPath = path.resolve(__dirname, '../../../web/data/stores.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('stores.json not found at', jsonPath);
    process.exit(1);
  }

  const stores: SeedStore[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  for (const store of stores) {
    const existing = await prisma.storeLocation.findUnique({ where: { slug: store.slug } });
    if (existing) {
      console.log(`Skipping existing store: ${store.name} (${store.slug})`);
      continue;
    }

    await prisma.storeLocation.create({
      data: {
        name: store.name,
        slug: store.slug,
        address: store.address,
        city: store.city,
        state: store.state,
        zip: store.zip,
        country: store.country,
        phone: store.phone,
        email: store.email,
        image: store.image || null,
        mapEmbedUrl: store.mapEmbedUrl || null,
        hours: store.hours ?? [],
        features: store.features ?? [],
        isActive: store.isActive ?? true,
        order: store.order ?? 0,
      },
    });
    console.log(`Seeded store: ${store.name} (${store.slug})`);
  }

  console.log('Store locations seeding complete.');
  await prisma.$disconnect();
}

seedStores().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
