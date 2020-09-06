import { RequestHandler } from "express";
import { check, validationResult } from "express-validator";

import BadRequest from "../errors/bad-request";
import ApplicationError from "../errors/application-error";

import * as AddressService from "../services/address-service";

export const create: RequestHandler = async (req, res, next) => {
  const { n, m, pubkeys } = req.body;
  await check("n", "n must be integer and greater than 0").isInt({ gt: 0 }).run(req);
  await check("m", "m must be integer and greater than 0").isInt({ gt: 0 }).run(req);
  await check("m", "m must be integer and equal or greater than n").not().isInt({ lt: n }).run(req);
  await check("pubkeys", "pubkeys should be array").isArray().run(req);
  await check("pubkeys").custom(() => {
    if (req.body.pubkeys.length === m) {
      return true;
    } else {
      return false;
    }
  })
    .withMessage("number of pubkeys should equal m").run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequest(errors.array().map(e => e.msg).join(", ")));
  }

  try {
    const result = AddressService.multiSigAddress(n, pubkeys);
    res.json({
      address: result
    });
  } catch (error) {
    return next(new ApplicationError(error.message));
  }
};
