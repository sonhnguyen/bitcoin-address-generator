import { RequestHandler } from "express";
import { check, validationResult } from "express-validator";

import BadRequest from "../errors/bad-request";
import ApplicationError from "../errors/application-error";

import * as AddressService from "../services/address-service";

export const create: RequestHandler = async (req, res, next) => {
  const { mnemonicSeed, path } = req.body;
  await check("mnemonicSeed", "mnemonicSeed cannot be blank").not().isEmpty().run(req);
  await check("path", "path cannot be blank").not().isEmpty().run(req);
  await check("mnemonicSeed").custom(() => {
    return AddressService.validateMnemonicSeed(req.body.mnemonicSeed);
  })
    .withMessage("should be a valid bip39 mnemonic seed").run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequest(errors.array().map(e => e.msg).join(", ")));
  }

  try {
    const nativeSegwitAddress = AddressService.nativeSegwitFromSeedPath(mnemonicSeed, path);
    const nestedSegwitAddress = AddressService.nestedSegwitFromSeedPath(mnemonicSeed, path);
    res.json({
      nativeSegwitAddress,
      nestedSegwitAddress
    });
  } catch (error) {
    return next(new ApplicationError(error.message));
  }
};
