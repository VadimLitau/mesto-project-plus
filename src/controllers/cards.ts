import { Response, Request, NextFunction } from 'express';
import { RequestCustom } from '../types/user';
import Card from '../models/card';
import { BadRequestErr, ForbiddenErr, NotFoundErr } from '../errors';
// eslint-disable-next-line import/extensions, import/no-unresolved
// eslint-disable-next-line max-len
const createCard = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const createdAt = new Date();

  return Card.create({
    name, link, owner: req.user?._id, createdAt,
  })
    .then((card) => res.send({ card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestErr(`${Object.values(error.errors).map((err:any) => err.message).join(', ')}`));
      }
      next(error);
    });
};

const findCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => next(err));
};

/* eslint no-else-return: "error" */

const deleteCard = (req: RequestCustom, res: Response, next:NextFunction) => {
  const { cardId } = req.params;
  Card.findById({ _id: cardId })
    .orFail(new Error('notValidId'))
    .then((cards) => {
      if (req.user?._id !== cards?.owner.toString()) {
        return next(new ForbiddenErr('Нельзя удалить чужую карточку'));
      }
      return res.status(200).send(cards);
    })
    .catch((error) => {
      if (error.message === 'notValidId') {
        return next(new NotFoundErr('Не валидный id карточки'));
      } else if (error.message === 'CastError') {
        return next(new BadRequestErr('Не валидный id карточки'));
      } next(error);
      // eslint-disable-next-line max-len
    });
};

const addLikeCard = (req: any, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('notValidId'))
    .then((card) => res.send(card?.likes))
    .catch((error) => {
      if (error.message === 'notValidId') {
        return next(new NotFoundErr('Не валидный id карточки'));
      } else if (error.message === 'CastError') {
        return next(new BadRequestErr('Не валидный id карточки'));
      } next(error);
    });
};

const deleteLikeCard = (req: any, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('notValidId'))
    .then((card) => res.send(card?.likes))
    .catch((error) => {
      if (error.message === 'notValidId') {
        return next(new NotFoundErr('Не валидный id карточки'));
      } else if (error.message === 'CastError') {
        return next(new BadRequestErr('Не валидный id карточки'));
      } next(error);
    });
};
// eslint-disable-next-line import/prefer-default-export
export {
  createCard, findCards, deleteCard, addLikeCard, deleteLikeCard,
};
