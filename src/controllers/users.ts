import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-unresolved
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RequestCustom } from '../types/user';
// eslint-disable-next-line import/extensions, import/no-unresolved
import User from '../models/user';
import { BadRequestErr, FoundEmailErr, NotFoundErr } from '../errors';
import { SECRET_KEY } from '../../config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '10d' }),
      });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    });
  })
    .then(async (user) => {
      const test = await User.findOne({ email: req.body.email }).exec();
      if (test) {
        return next(new FoundEmailErr('Пользователь с такой почтой уже зарегистрирован'));
      }
      res.status(200).send({ message: 'Регистрация прошла успешно', user });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestErr(`${Object.values(error.errors).map((err:any) => err.message).join(', ')}`));
      }
      next(error);
    });
};

const findUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => next(err));
};

const findUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  User.find({ _id: userId })
    .then((users) => {
      if (users.length === 0) {
        return next(new NotFoundErr('Пользователь с указанным id не найден'));
      }
      return res.status(200).send(users);
    })
    .catch((error) => {
      next(error);
    });
};

const updateUser = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(`${Object.values(err.errors).map((error:any) => error.message).join(', ')}`));
      }
      next(err);
    });
};

const updateAvatar = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(`${Object.values(err.errors).map((error:any) => error.message).join(', ')}`));
      }
      next(err);
    });
};

const getMe = (req: RequestCustom, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .orFail(new Error('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.message === 'Пользователь не найден') {
        return next(new NotFoundErr('Пользователь не найден'));
      } next(error);
    });
};
export {
  createUser, findUsers, findUser, updateUser, updateAvatar, login, getMe,
};

// В который раз убеждаюсь, что если хочется спать, то ненадо садиться за код)Спасибо за видео)
