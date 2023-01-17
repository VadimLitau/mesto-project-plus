import { Response, Request } from 'express';
import { RequestCustom } from '../types/user';
// eslint-disable-next-line import/extensions, import/no-unresolved
import Card from '../models/card';
// eslint-disable-next-line max-len
const createCard = (req: RequestCustom, res: Response) => {
  const { name, link } = req.body;
  const createdAt = new Date();

  return Card.create({
    name, link, owner: req.user?._id, createdAt,
  })
    .then((card) => res.send({ card }))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка: неверно заполнены поля' }));
};

const findCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ cards }))
  .catch(() => res.status(404).send({ message: 'Произошла ошибка: неверно заполнены поля' }));

const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send(card))
    .catch(() => res.status(404).send({ message: 'Произошла ошибка: карточка не найден' }));
};

const addLikeCard = (req: any, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send(card?.likes))
    .catch(() => res.status(404).send({ message: 'Произошла ошибка: карточка не найден' }));
};

const deleteLikeCard = (req: any, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send(card?.likes))
    .catch(() => res.status(404).send({ message: 'Произошла ошибка: карточка не найден' }));
};
// eslint-disable-next-line import/prefer-default-export
export {
  createCard, findCards, deleteCard, addLikeCard, deleteLikeCard,
};
