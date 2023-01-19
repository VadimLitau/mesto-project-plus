import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { RequestCustom } from '../types/user';
// eslint-disable-next-line import/extensions, import/no-unresolved
import User from '../models/user';

const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
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
      if (error instanceof Error && error.name === 'NotFoundError') {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateUser = (req: RequestCustom, res: Response) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
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
export {
  createUser, findUsers, findUser, updateUser, updateAvatar,
};
