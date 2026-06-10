import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createAddressSchema, updateAddressSchema } from '../dto/address.dto';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/address.controller';

const router: Router = Router();

router.use(authenticateToken);

router.get('/', getAddresses);
router.post('/', validate(createAddressSchema), createAddress);
router.put('/:id', validate(updateAddressSchema), updateAddress);
router.delete('/:id', deleteAddress);
router.put('/:id/default', setDefaultAddress);

export default router;
