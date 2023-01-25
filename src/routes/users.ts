import { Router } from 'express';
import {
  findUsers, findUser, updateUser, updateAvatar, getMe,
} from '../controllers/users';

const router = Router();

router.get('/', findUsers);
router.get('/me', getMe);
router.get('/:userId', findUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
