import express from 'express';
// deleteAllClasss
import {
  createOrUpdateQuestion, deleteQuestion, getCurrentQuestion,
} from '../controllers/question.js';

const router = express.Router();

router.post('/', createOrUpdateQuestion);
router.put('/', createOrUpdateQuestion);
router.get('/:taskId', getCurrentQuestion);
// router.delete('/deleteAll', deleteAllClasss);
router.delete('/:questionId', deleteQuestion);

export default router;
