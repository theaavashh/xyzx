import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });
    console.log(`Found ${users.length} users in database:`);
    users.forEach((user) => {
      console.log(
        `  - ${user.email} (${user.name}) - Role: ${user.role}, Active: ${user.isActive}`,
      );
    });

    // Create test user with known password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('test123', 10);

    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'user',
      },
    });

    console.log('Test user ready:', testUser.email);
    console.log('Password: test123');
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
