import express from 'express';
import {
  createAnswer,
} from '../controllers/answer.js';

const router = express.Router();

router.post('/:questionId', createAnswer);

export default router;
