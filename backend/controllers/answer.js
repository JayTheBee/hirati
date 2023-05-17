/* eslint-disable import/prefer-default-export */
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import createError from '../utils/createError.js';

// local functions
const getQuestion = async (questionId) => {
  try {
    const question = await Question.findById({ _id: questionId });
    return (question);
  } catch (err) {
    return (console.log(err));
  }
};

// automated check logic
const automatedChecking = async (data) => {
  const question = await getQuestion(data.questionId);
  console.log(question);
};

// user main function -> Answer to db with automatic check
export const createAnswer = async (req, res, next) => {
  // pa log kung nalilito naka dummy data na yan
  // console.log(req.body);
  // console.log(req.user);
  const questionData = {
    code: req.body.code,
    userId: req.user.id,
    questionId: req.body.questionId,
    testcase: req.body.testcase,
    resultAnswer: {
      cputime: req.body.time,
      memory: req.body.memory,
      status: req.body.status,
    },
    input: req.body.input,
    output: req.body.output,
    time: req.body.time,
  };

  automatedChecking(questionData);
  //    for uncomment later
  // const newAnswer = new Answer(questionData);
  // try {
  //   const userClass = await newAnswer.save();
  //   return res.status(200).json(userClass);
  // } catch (err) {
  //   console.log(err);
  //   return next(err);
  // }
};

// TODO LIST PA
// Perform Automated Assesment here
// -> get all answer by                               goodss na
// -> get all Question                                goods na
// -> compare input by output
// -> check keywords (using js method search)
// -> check metric weights(from question fetch)
// -> percentage to total points( % * total points)(computation nalang)
// -> calculate points(cpuscore,memoryscore, statusscore = total aquiredpoints)(notsure pa dito)
