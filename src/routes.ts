
import { Router } from 'express';

import * as SegwitController from './controllers/segwit';
import * as MultiSigController from './controllers/multiSig';

const router = Router();

// address generation routes
router.post('/segwit', SegwitController.create);
router.post('/multisig', MultiSigController.create);

export default router;
