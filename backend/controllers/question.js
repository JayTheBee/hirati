import Question from '../models/Question.js';
import createError from '../utils/createError.js';

export const createOrUpdateQuestion = async (req, res, next) => {
  const questionData = {
    questionCount: req.body.count,
    description: req.body.description,
    taskId: req.body.task_id,
    // testcase: {
    //   input: req.body.input,
    //   output: req.body.output,
    // },
    testcase: req.body.testcase,
    rubrics: {
      cputime: req.body.cputime,
      memory: req.body.memory,
      status: req.body.status,
    },

    rubricAdditional: req.body.rubrics,
    code: req.body.result.code,
    permission: req.body.permission,
    caseFlag: req.body.caseFlag,
    points: req.body.points,
    language: req.body.result.language,
    keywords: req.body.keywords,
    resultSample: {
      time: req.body.result.time,
      memory: req.body.result.memory,
      status: req.body.result.status,
    },
  };
  if (Object.prototype.hasOwnProperty.call(req.body, 'questionId')) {
    const question = await Question.findById(req.body.questionId).exec();
    if (!question) return next(createError({ status: 404, message: 'Question Id not found!' }));
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        { _id: req.body.questionId },
        questionData,
        { new: true },
      );
      return res.status(200).json(updatedQuestion);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  } else {
    try {
      const querySave = new Question(questionData);
      const createQuestion = await querySave.save();
      return res.status(200).json(createQuestion);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
};

export const getCurrentQuestion = async (req, res, next) => {
  try {
    // const question = await Question.find({ taskId: req.params.taskId }).sort({ createdAt: -1 });
    const question = await Question.find({ taskId: req.params.taskId });
    return res.status(200).json(question);
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
    const question = await Question.findById(req.params.questionId);
    if (question) { await Question.findOneAndDelete({ _id: req.params.questionId }); }
    return res.json('Question Deleted Successfully');
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
