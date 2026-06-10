import { prisma } from '../lib/database';
import dotenv from 'dotenv';

dotenv.config();



async function updateAdminRole() {
  try {
    const result = await prisma.user.update({
      where: { email: 'admin@rapharch.com' },
      data: { role: 'admin' },
    });

    console.log('Updated admin role:', result);
    console.log('User email: admin@rapharch.com now has role: admin');
  } catch (error) {
    console.error('Error updating admin role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminRole().then(() => {
  console.log('Script completed');
  process.exit(0);
});
