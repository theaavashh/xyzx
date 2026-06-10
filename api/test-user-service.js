import { UserService } from './src/services/UserService.js';

const userService = new UserService();

async function testUserService() {
  try {
    console.log('🔍 Testing findUserByEmail...');
    const user = await userService.findUserByEmail('test@example.com');

    if (user) {
      console.log('User found:', user.email);

      console.log('Testing validatePassword...');
      const isValid = await userService.validatePassword(
        'test123',
        user.password,
      );
      console.log('Password validation result:', isValid);
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('UserService error:', error);
    console.error('Stack:', error.stack);
  } finally {
    await userService.disconnect();
  }
}

testUserService();
