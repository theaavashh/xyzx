import { Router } from 'express';
import { updateProfile } from '../controllers/user.controller';
import { getProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth';

const router: Router = Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;
