import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SessionCustom } from '../types/user';

export default (req: SessionCustom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (error:any) {
    return res.status(401).send({ message: error });
  }

  req.user = payload;

  next();
};
