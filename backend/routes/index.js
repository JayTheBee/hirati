import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import authRoutes from './auth.js';
import usersRoutes from './users.js';
import tasksRoutes from './tasks.js';
import classsRoutes from './class.js';
import questionRoutes from './question.js';
import answerRoutes from './answer.js';
// import { autocheck } from '../controllers/answer.js';

const router = express.Router();

router.use('/auth', authRoutes);
// router.post('/test', autocheck);
router.use('/users', checkAuth, usersRoutes);
router.use('/tasks', checkAuth, tasksRoutes);
router.use('/class', checkAuth, classsRoutes);
router.use('/question', checkAuth, questionRoutes);
router.use('/answer', checkAuth, answerRoutes);

export default router;
