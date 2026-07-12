import dotenv from 'dotenv';
import { prisma } from '../lib/database';
import bcrypt from 'bcryptjs';

dotenv.config();

async function createAdminUser() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@rapharch.com';
    const password = process.env.ADMIN_PASSWORD;

    if (!password || password.length < 8) {
      console.error('ADMIN_PASSWORD environment variable must be set (min 8 characters)');
      process.exit(1);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Admin user already exists:', {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const adminUser = await prisma.user.create({
      data: {
        name: process.env.ADMIN_NAME || 'Admin User',
        email,
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    });
  } catch (error: any) {
    console.error('Error creating admin user:', error.message);
  }
}

createAdminUser()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
