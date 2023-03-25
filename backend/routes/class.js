import express from 'express';
// deleteAllClasss
import {
  createClass, deleteClass, getCurrentUserClasss, updateClass, joinClass,
} from '../controllers/class.js';

const router = express.Router();

router.post('/', createClass);
router.put('/:classId', updateClass);
router.put('/joinClass/:teamCode', joinClass);
router.get('/myClass', getCurrentUserClasss);
// router.delete('/deleteAll', deleteAllClasss);
router.delete('/:classId', deleteClass);

export default router;
