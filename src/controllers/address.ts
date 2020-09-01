import { RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../middleware/request-middleware';

export const addBookSchema = Joi.object().keys({
  name: Joi.string().required(),
  author: Joi.string().required()
});

const newSegwitAddress: RequestHandler = async (req, res) => {
  const { name, author } = req.body;

  // const book = new Book({ name, author });
  // await book.save();

  res.send({
    message: 'Saved',
  });
};

export default requestMiddleware(newSegwitAddress, { validation: { body: addBookSchema } });
export {
  newSegwitAddress,
};
