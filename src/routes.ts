import { Router } from "express";

import * as SegwitController from "./controllers/segwit/segwit";
import * as MultiSigController from "./controllers/multisig/multisig";

const router = Router();

// address generation routes
router.post("/segwit", SegwitController.create);
router.post("/multisig", MultiSigController.create);

export default router;
