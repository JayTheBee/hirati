import express from 'express';
// deleteAllClasss
import { createAnswer } from '../controllers/answers.js';

const router = express.Router();

router.post('/', createAnswer);


export default router;
