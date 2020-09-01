
import { Router } from 'express';

import * as SegwitController from './controllers/segwit';

const router = Router();

// address generation routes
router.post('/segwit', SegwitController.create);

export default router;
