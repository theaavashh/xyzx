import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  createStaffSchema,
  updateStaffSchema,
  staffPermissionsSchema,
  staffQuerySchema,
} from '../dto/staff.dto';
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  toggleStaffStatus,
  updateStaffPermissions,
} from '../controllers/staff.controller';

const router: Router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/', validate(staffQuerySchema, 'query'), getStaff);
router.get('/:id', getStaffById);
router.post('/', validate(createStaffSchema), createStaff);
router.put('/:id', validate(updateStaffSchema), updateStaff);
router.delete('/:id', deleteStaff);
router.patch('/:id/toggle', toggleStaffStatus);
router.put('/:id/permissions', validate(staffPermissionsSchema), updateStaffPermissions);

export default router;
