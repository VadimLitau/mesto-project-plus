import { Router } from 'express';
import {
  createUser, findUsers, findUser, updateUser, updateAvatar,
} from '../controllers/users';

const router = Router();

router.post('/', createUser);
router.get('/', findUsers);
router.get('/:userId', findUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
