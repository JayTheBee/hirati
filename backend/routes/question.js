import express from 'express';
// deleteAllClasss
import {
  createQuestion, deleteQuestion, getCurrentQuestion, updateQuestion,
} from '../controllers/question.js';

const router = express.Router();

router.post('/', createQuestion);
router.put('/:taskId/:questionId', updateQuestion);
router.get('/:taskId', getCurrentQuestion);
// router.delete('/deleteAll', deleteAllClasss);
router.delete('/:taskId/:questionId', deleteQuestion);

export default router;
