import express from 'express';
import {
  createTask, deleteAllTasks, deleteTask, getAllTasks, getCurrentUserTasks, updateTask,getTask
} from '../controllers/task.js';

const router = express.Router();

// router.get('/all', getAllTasks);
router.post('/', createTask);
router.put('/:classId/:taskId', updateTask);
router.get('/:classId', getCurrentUserTasks);
router.post('/:taskId', getTask);
router.delete('/:classId/', deleteAllTasks);
router.delete('/:classId/:taskId', deleteTask);

export default router;
