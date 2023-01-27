import { Router } from 'express';
import { validateFindUser, validateUpdateAvatar, validateUpdateUser } from '../middlewares/validation';
import {
  findUsers, findUser, updateUser, updateAvatar, getMe,
} from '../controllers/users';

const router = Router();

router.get('/', findUsers);
router.get('/me', getMe);
router.get('/:userId', validateFindUser, findUser);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default router;
