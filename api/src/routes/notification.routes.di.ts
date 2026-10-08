import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import {
  getNotifications,
  createNotification,
  createBulkNotifications,
  markAsRead,
  markAllAsRead,
  markAsUnread,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
} from '../controllers/notification.controller.di.js';

const router: Router = Router();

// User routes (authenticated)
router.get('/', authenticateToken, getNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.post('/', authenticateToken, createNotification);
router.post('/bulk', authenticateToken, createBulkNotifications);
router.post('/mark-all-read', authenticateToken, markAllAsRead);
router.post('/clear-all', authenticateToken, clearAllNotifications);
router.patch('/:id/read', authenticateToken, markAsRead);
router.patch('/:id/unread', authenticateToken, markAsUnread);
router.delete('/:id', authenticateToken, deleteNotification);

export default router;