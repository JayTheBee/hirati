import express from 'express';
// deleteAllClasss
import {
  lintC, lintCPP, lintJava, lintPython
} from '../utils/callLinter.js';

const router = express.Router();

router.post('/java', lintJava)
router.post('/python', lintPython)
router.post('/c', lintC)
router.post('/cpp', lintCPP)

export default router