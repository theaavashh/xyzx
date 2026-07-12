import { prisma } from '../lib/database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();



async function createAdminUser() {
  try {
    const email = process.env.ADMIN_EMAIL || 'aavash.ganeju@gmail.com';
    const password = process.env.ADMIN_PASSWORD;
    if (!password || password.length < 8) {
      console.error('ADMIN_PASSWORD environment variable must be set (min 8 characters)');
      process.exit(1);
    }
    const name = process.env.ADMIN_NAME || 'Aavash Ganeju';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');

      return;
    }

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
        isActive: true,
      },
    });

    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  createAdminUser().catch(console.error);
}
