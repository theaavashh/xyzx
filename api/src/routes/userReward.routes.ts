import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { getUserRewardBalance, getUserRewardHistory } from '../controllers/user-reward.controller';

const router: Router = Router();

router.get('/:userId', authenticateToken, getUserRewardBalance);
router.post('/:userId/redeem', authenticateToken, getUserRewardHistory);

export default router;
