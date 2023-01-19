import { Response, Request } from 'express';
import { RequestCustom } from '../types/user';
import Card from '../models/card';
// eslint-disable-next-line import/extensions, import/no-unresolved
// eslint-disable-next-line max-len
const createCard = (req: RequestCustom, res: Response) => {
  const { name, link } = req.body;
  const createdAt = new Date();

  return Card.create({
    name, link, owner: req.user?._id, createdAt,
  })
    .then((card) => res.send({ card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Произошла ошибка: неверно заполнены поля' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const findCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ cards }))
  .catch(() => res.status(404).send({ message: 'Произошла ошибка: неверно заполнены поля' }));

const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete({ _id: cardId })
    .orFail(new Error('notValidId'))
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((error) => {
      if (error.message === 'notValidId') {
        return res.status(404).send({ message: 'Не валидный id карточки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const addLikeCard = (req: any, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('CastError'))
    .then((card) => res.send(card?.likes))
    .catch((error) => {
      if (error.message === 'CastError') {
        return res.status(404).send({ message: 'Не валидный id карточки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const deleteLikeCard = (req: any, res: Response) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('CastError'))
    .then((card) => res.send(card?.likes))
    .catch((error) => {
      if (error.message === 'CastError') {
        return res.status(404).send({ message: 'Не валидный id карточки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
// eslint-disable-next-line import/prefer-default-export
export {
  createCard, findCards, deleteCard, addLikeCard, deleteLikeCard,
};
