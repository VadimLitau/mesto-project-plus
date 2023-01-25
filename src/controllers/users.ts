import { Request, Response } from 'express';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-unresolved
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RequestCustom } from '../types/user';
// eslint-disable-next-line import/extensions, import/no-unresolved
import User from '../models/user';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '10d' }),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const createUser = (req: Request, res: Response) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    });
  })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Произошла ошибка: неверно заполнены поля' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const findUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ users }))
  .catch(() => res.status(404).send({ message: 'Произошла ошибка: неверно заполнены поля' }));

const findUser = (req: Request, res: Response) => {
  const { userId } = req.params;
  User.find({ _id: userId })
    .then((users) => {
      if (users.length === 0) return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      return res.status(200).send(users);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Не валидный id пользователя' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateUser = (req: RequestCustom, res: Response) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Произошла ошибка: неверно заполнены поля' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req: RequestCustom, res: Response) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Произошла ошибка: неверно заполнены поля' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const getMe = (req: RequestCustom, res: Response) => {
  User.findById(req.user?._id)
    .orFail(new Error('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.message === 'Пользователь не найден') {
        return res.status(404).send({ message: 'Пользователь не найден' });
      } return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
export {
  createUser, findUsers, findUser, updateUser, updateAvatar, login, getMe,
};

// В который раз убеждаюсь, что если хочется спать, то ненадо садиться за код)Спасибо за видео)
