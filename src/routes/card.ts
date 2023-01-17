import { Router } from 'express';
import {
  addLikeCard, createCard, deleteCard, deleteLikeCard, findCards,
} from '../controllers/cards';

const router = Router();

router.post('/', createCard);
router.get('/', findCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLikeCard);
router.delete('/:cardId/likes', deleteLikeCard);

export default router;
