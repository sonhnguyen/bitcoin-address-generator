
import { Router } from 'express';

import * as AddressController from './controllers/address';

const router = Router();

// Book routes
router.post('/address/segwit', AddressController.newSegwitAddress);

export default router;
