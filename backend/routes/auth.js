import express from 'express';
import {
  isLoggedIn, login, logout, register, verify,
} from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/is_logged_in', isLoggedIn);
router.get('/:id/verify/:token', verify);

export default router;
