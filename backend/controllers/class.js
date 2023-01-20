import Class from '../models/Class.js';
import createError from '../utils/createError.js';

export const createClass = async (req, res, next) => {
  const newClass = new Class({
    className: req.body.className,
    studentEmail: req.body.studentEmail,
    userId: req.user.id,
  });
  try {
    const userClass = await newClass.save();
    return res.status(200).json(userClass);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const targetClass = await Class.findById(req.params.classId).exec();
    if (!targetClass) return next(createError({ status: 404, message: 'Class not found' }));
    if (targetClass.userId.toString() !== req.user.id) return next(createError({ status: 401, message: "It's not your class." }));
    const updatedList = await Class.findByIdAndUpdate(req.params.classId, {
      className: req.body.className,
      studentEmail: req.body.studentEmail,
    }, { new: true });
    return res.status(200).json(updatedList);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const getCurrentUserClasss = async (req, res, next) => {
  try {
    const targetClass = await Class.find({ user: req.user.id });
    return res.status(200).json(targetClass);
  } catch (err) {
    return next(err);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const targetClass = await Class.findById(req.params.classId);
    if (targetClass.user === req.user.id) {
      return next(createError({ status: 401, message: "It's not your class to delete." }));
    }
    // await Class.findByIdAndDelete(req.params.classId);
    await Class.findOneAndDelete({ _id: req.params.classId });
    return res.json('Class Deleted Successfully');
  } catch (err) {
    return next(err);
  }
};

export const deleteAllClasss = async (req, res, next) => {
  try {
    await Class.deleteMany({ user: req.user.id });
    return res.json('All Class Deleted Successfully');
  } catch (err) {
    return next(err);
  }
};
