import Question from '../models/Class.js';
import createError from '../utils/createError.js';

export const createQuestion = async (req, res, next) => {
  const questionData = new Question({
    title: req.body.title,
    description: req.body.description,
    taskId: req.body.id,
    performance: {
      cputime: req.body.cputime,
      memory: req.body.memory,
      score: req.body.score,
    },
    testcase: {
      input: req.body.input,
      output: req.body.output,
    },
    example: req.body.example,
    constraints: req.body.constraints,
  });
  try {
    const userQuestion = await questionData.save();
    return res.status(200).json(userQuestion);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const targetTask = await Question.findById(req.params.taskId).exec();
    if (!targetTask) return next(createError({ status: 404, message: 'Invalid target Task Id' }));
    if (targetTask.userId.toString() !== req.user.id) return next(createError({ status: 401, message: "It's not your class." }));
    const updatedTask = await Question.findByIdAndUpdate(req.params.taskId, {
      title: req.body.title,
      description: req.body.description,
      performance: {
        cputime: req.body.cputime,
        memory: req.body.memory,
        score: req.body.score,
      },
      testcase: {
        input: req.body.input,
        output: req.body.output,
      },
      example: req.body.example,
      constraints: req.body.constraints,
    }, { new: true });
    return res.status(200).json(updatedTask);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const getCurrentQuestion = async (req, res, next) => {
  try {
    const targetQuestion = await Question.find({ user: req.body.id });
    return res.status(200).json(targetQuestion);
  } catch (err) {
    return next(err);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    // const targetClass = await Question.findById(req.params.classId);
    // if (targetClass.user === req.user.id) {
    //   return next(createError({ status: 401, message: "It's not your class to delete." }));
    // }
    // await Class.findByIdAndDelete(req.params.classId);
    const targetClass = await Question.findById(req.params.classId);
    if (targetClass) { await Question.findOneAndDelete({ _id: req.params.classId }); }
    return res.json('Class Deleted Successfully');
  } catch (err) {
    return next(err);
  }
};

// export const deleteAllClasss = async (req, res, next) => {
//   try {
//     await Class.deleteMany({ user: req.user.id });
//     return res.json('All Class Deleted Successfully');
//   } catch (err) {
//     return next(err);
//   }
// };
