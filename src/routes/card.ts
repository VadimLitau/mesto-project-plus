import { Router } from 'express';
import { validateCardId, validateCreateCard } from '../middlewares/validation';
import {
  addLikeCard, createCard, deleteCard, deleteLikeCard, findCards,
} from '../controllers/cards';

const router = Router();

router.post('/', validateCreateCard, createCard);
router.get('/', findCards);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, addLikeCard);
router.delete('/:cardId/likes', validateCardId, deleteLikeCard);

export default router;
