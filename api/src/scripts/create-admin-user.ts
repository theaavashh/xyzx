import dotenv from 'dotenv';
import { createUser } from '../services/user.service';
import { prisma } from '../lib/database';
import bcrypt from 'bcryptjs';

dotenv.config();

async function createAdminUser() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@rapharch.com' },
    });

    if (existingUser) {
      console.log('Admin user already exists:', {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123456', 10);
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@rapharch.com',
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
