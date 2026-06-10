import { Router } from 'express';
import { createPosSale, listPosSales, getPosSale } from '../controllers/pos.controller';

const router: Router = Router();

router.post('/sales', createPosSale);
router.get('/sales', listPosSales);
router.get('/sales/:id', getPosSale);

export default router;
