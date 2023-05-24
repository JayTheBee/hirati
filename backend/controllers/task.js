import Task from '../models/Task.js';
import createError from '../utils/createError.js';

export const createTask = async (req, res, next) => {
  const newTask = new Task({
    title: req.body.title,
    category: req.body.category,
    classId: req.body.classId,
    completed: req.body.completed,
    dateExp: req.body.dateExp,

  });
  try {
    const savedTask = await newTask.save();
    return res.status(200).json(savedTask);
  } catch (err) {
    return next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    // console.log(req.params.taskId);
    const task = await Task.findById(req.params.taskId).exec();
    if (!task) return next(createError({ status: 404, message: 'Task not found' }));

    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, {
      title: req.body.title,
      category: req.body.category,

      completed: req.body.completed,
      dateExp: req.body.dateExp,
    }, { new: true });
    return res.status(200).json(updatedTask);
  } catch (err) {
    return next(err);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({});
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
};

export const getCurrentUserTasks = async (req, res, next) => {
  try {
    // const tasks = await Task.find({ user: req.params.classId });
    const task = await Task.find({ classId: req.params.classId });
    return res.status(200).json(task);
  } catch (err) {
    return next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await Task.findById(req.params.taskId);
    // if (task.user === req.user.id) {
    //   return next(createError({ status: 401, message: "It's not your todo." }));
    // }
    await Task.findByIdAndDelete(req.params.taskId);
    return res.json('Task Deleted Successfully');
  } catch (err) {
    return next(err);
  }
};

export const deleteAllTasks = async (req, res, next) => {
  try {
    await Task.deleteMany({ user: req.user.id });
    return res.json('All Todo Deleted Successfully');
  } catch (err) {
    return next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const taskResp = await Task.findById(req.params.taskId);
    return res.json(taskResp);
  } catch (err) {
    return next(err);
  }
};
