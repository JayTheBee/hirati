import express from 'express';
import {
  createAnswer, addAllAnswer, getAnswers, getAnswerById,
} from '../controllers/answer.js';

const router = express.Router();

router.post('/:questionId', createAnswer);
router.post('/', addAllAnswer);
router.get('/getAll/:questionId', getAnswers);
router.get('/get/:answerId', getAnswerById);

export default router;
