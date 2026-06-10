import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createUserSchema, updateUserSchema, userQuerySchema, userRoleSchema } from '../dto/user.dto';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserRole,
} from '../controllers/user.controller';

const router: Router = Router();

router.use(authenticateToken);

router.get('/', validate(userQuerySchema, 'query'), getUsers);
router.get('/:id', getUserById);
router.post('/', requireAdmin, validate(createUserSchema), createUser);
router.put('/:id', requireAdmin, validate(updateUserSchema), updateUser);
router.delete('/:id', requireAdmin, deleteUser);
router.patch('/:id/toggle', requireAdmin, toggleUserStatus);
router.patch('/:id/role', requireAdmin, validate(userRoleSchema), updateUserRole);

export default router;
