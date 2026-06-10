import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import {
  getNotifications,
  createNotification,
  createBulkNotifications,
  markAsRead,
  markAllAsRead,
  markAsUnread,
  deleteNotification,
  clearAll,
  getUnreadCount,
} from '../controllers/notification.controller';

const router: Router = Router();

router.get('/', authenticateToken, getNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.post('/', authenticateToken, requireAdmin, createNotification);
router.post('/bulk', authenticateToken, requireAdmin, createBulkNotifications);
router.patch('/:id/read', authenticateToken, markAsRead);
router.patch('/read-all', authenticateToken, markAllAsRead);
router.patch('/:id/unread', authenticateToken, markAsUnread);
router.delete('/:id', authenticateToken, deleteNotification);
router.delete('/clear-all', authenticateToken, clearAll);

export default router;
