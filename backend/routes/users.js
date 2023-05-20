import express from 'express';
import { getUserInfo, updateUser, getUserById } from '../controllers/users.js';

const router = express.Router();

// for dev only
// router.get('/', getAllUsers);
// router.post('/', createUser);

router.get('/me', getUserInfo);
router.put('/me', updateUser);
router.get('/:userId', getUserById);

export default router;
