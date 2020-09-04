import { RequestHandler } from 'express';
import { check, validationResult } from "express-validator";

import ApplicationError from '../errors/application-error';
import * as AddressService from '../services/address-service';

export const create: RequestHandler = async (req, res, next) => {
  const { seed, path } = req.body;
  await check("seed", "Seed cannot be blank").not().isEmpty().run(req);
  await check("path", "Path cannot be blank").not().isEmpty().run(req);
  await check("seed", "Seed should have minimum 32 characters (128 bits)").isString().isLength({ min: 32 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }

  try {
    const result = await AddressService.segwitFromSeedPath(seed, path)
    res.send(result);
  } catch (error) {
    return next(new ApplicationError(error.message));
  }
};
