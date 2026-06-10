import { Router } from 'express';
import { getUsers, updateProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth';

const router: Router = Router();

router.get('/profile', getUsers);
router.put('/profile', authenticateToken, updateProfile);

export default router;
