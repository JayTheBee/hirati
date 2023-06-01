import express from 'express';
import {
  createAnswer, addAllAnswer, getAnswers, getAnswerById, getAllQuestionByTask,
  updateRubric
} from '../controllers/answer.js';

const router = express.Router();

router.post('/:questionId', createAnswer);
router.post('/updateRubric/:answerId', updateRubric);
router.post('/', addAllAnswer);
router.get('/:taskId', getAllQuestionByTask);
router.get('/getAll/:questionId', getAnswers);
router.get('/get/:answerId', getAnswerById);

export default router;
