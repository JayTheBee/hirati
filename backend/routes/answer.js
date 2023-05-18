import express from 'express';
import {
  createAnswer, addAllAnswer,
} from '../controllers/answer.js';

const router = express.Router();

router.post('/:questionId', createAnswer);
router.post('/', addAllAnswer);

export default router;
