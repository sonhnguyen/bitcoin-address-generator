import { RequestHandler } from 'express';
import { check, validationResult } from "express-validator";

import BadRequest from '../errors/bad-request';
import ApplicationError from '../errors/application-error';

import * as AddressService from '../services/address-service';

export const create: RequestHandler = async (req, res, next) => {
  const { seed, path } = req.body;
  await check("seed", "seed cannot be blank").not().isEmpty().run(req);
  await check("path", "path cannot be blank").not().isEmpty().run(req);
  await check("seed", "seed should have minimum 32 characters (128 bits)").isString().isLength({ min: 32 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequest(errors.array().map(e => e.msg).join(", ")));
  }

  try {
    const result = AddressService.segwitFromSeedPath(seed, path)
    res.json({
      address: result
    });
  } catch (error) {
    return next(new ApplicationError(error.message));
  }
};
