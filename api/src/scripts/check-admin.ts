
import dotenv from 'dotenv';
import { prisma } from '../lib/database';

// Load environment variables
dotenv.config();



async function checkAdminUser() {
  try {
    const email = 'aavash.ganeju@gmail.com';

    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email },
    });

    if (adminUser) {
      console.log('Admin user found!');
    } else {
      console.log('Admin user not found');
      console.log(`No user with email: ${email}`);
    }

    // Also check for any admin users
    const allAdmins = await prisma.user.findMany({
      where: { role: 'admin' },
    });

    console.log('\nAll admin users in database:');

    if (allAdmins.length > 0) {
      allAdmins.forEach((admin: { email: string; role: string; name: string; id: string; isActive: boolean }, index: number) => {
        console.log(
          `${index + 1}. ${admin.name} (${admin.email}) - ID: ${admin.id}`,
        );
      });
    } else {
      console.log('No admin users found in database');
    }
  } catch (error) {
    console.error('Error checking admin user:', error);
    if (error instanceof Error) {
      if (error.message.includes('Authentication failed')) {
        console.log(
          '\nDatabase connection failed. Please check your DATABASE_URL in .env file',
        );
      } else if (error.message.includes("doesn't exist")) {
        console.log(
          "\nDatabase table doesn't exist. Run: npx prisma migrate dev",
        );
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkAdminUser();
