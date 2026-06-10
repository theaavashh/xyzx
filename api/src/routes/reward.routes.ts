import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { rewardSettingsSchema, rewardCreateSchema } from '../dto/settings.dto';
import { getRewardSettings, updateRewardSettings, getUserRewards, addManualReward } from '../controllers/reward.controller';

const router: Router = Router();

router.get('/settings', authenticateToken, getRewardSettings);
router.put('/settings', authenticateToken, requireAdmin, validate(rewardSettingsSchema), updateRewardSettings);
router.get('/history', authenticateToken, getUserRewards);
router.post('/', authenticateToken, requireAdmin, validate(rewardCreateSchema), addManualReward);

export default router;
