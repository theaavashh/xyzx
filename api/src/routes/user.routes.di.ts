import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';
import {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserRole,
  createPublicUser,
} from '../controllers/user.controller.di.js';

const router: Router = Router();

// Public routes
router.post('/', createPublicUser);

// Protected routes (require authentication)
router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/profile', authenticateToken, updateProfile);

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, createUser);
router.put('/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);
router.patch('/:id/toggle-status', authenticateToken, requireAdmin, toggleUserStatus);
router.patch('/:id/role', authenticateToken, requireAdmin, updateUserRole);

export default router;