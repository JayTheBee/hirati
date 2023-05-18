import express from 'express';
// deleteAllClasss
import {
  lintC, lintCPP, lintJava, lintPython,
} from '../utils/callLinter.js';

const router = express.Router();

router.post('/Java', lintJava);
router.post('/Python', lintPython);
router.post('/C', lintC);
router.post('/CPP', lintCPP);

export default router;
