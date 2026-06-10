import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { getColorSettings, updateColorSettings } from '../controllers/color-theme.controller';

const router: Router = Router();

router.get('/', getColorSettings);
router.put('/', authenticateToken, updateColorSettings);

export default router;
