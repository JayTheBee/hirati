import express from 'express';
import {
  createAnswer, addAllAnswer, getAnswers, getAnswerById, getAllQuestionByTask,
  updateAnswer, getUserAnswers
} from '../controllers/answer.js';

const router = express.Router();

router.post('/:questionId', createAnswer);
router.post('/', addAllAnswer);
router.get('/:taskId', getAllQuestionByTask);
router.get('/getAll/:questionId', getAnswers);
router.get('/get/:answerId', getAnswerById);
router.get('/user/:questionId', getUserAnswers)
router.post('/update/:answerId', updateAnswer);

export default router;
