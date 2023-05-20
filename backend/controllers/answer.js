/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import createError from '../utils/createError.js';
// local functions
const getQuestion = async (questionId) => {
  try {
    const question = await Question.findById({ _id: questionId });
    console.log('QUESTION IS: ', question);
    return (question);
  } catch (err) {
    return (console.log(err));
  }
};

// Make a function to get all the answers connected to a question
export const getAnswers = async (req, res, next) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId });
    return res.status(200).json(answers);
  } catch (err) {
    console.log(err);
  }
};

// Make a function to get answer by id
export const getAnswerById = async (req, res, next) => {
  try {
    const answer = await Answer.findById({ _id: req.params.answerId });
    return res.status(200).json(answer);
  } catch (err) {
    console.log(err);
  }
};

// user main function -> Answer to db with automatic check
export const createAnswer = async (req, res, next) => {
  // pa log kung nalilito naka dummy data na yan
  console.log('SOBRANG HABANG DATA: ', req.body);

  const questionData = {
    code: req.body.code,
    userId: req.user.id,
    questionId: req.body.questionId,
    code_tokens: req.body.code_tokens,
    resultAnswer: {
      cputime: req.body.time,
      memory: req.body.memory,
      status: req.body.status,
    },
  };
  questionData.score = await autocheck(questionData, req.body.id);
  //  for uncomment later
  console.log('THIS IS THE DATABASE DATA: ', questionData);
  const newAnswer = new Answer(questionData);
  try {
    // autocheck(req.body);
    const userAnswer = await newAnswer.save();
    console.log('THIS IS THE USER ANSWER SAVED: ', userAnswer);
    return res.status(200).json(userAnswer);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const getScore = async (dataresArr, question) => {
  try {
    const cputimeConstraint = parseFloat(question.resultSample.time) + (0.010 * dataresArr.length);
    const memoryConstraint = question.resultSample.memory + (500 * dataresArr.length);
    let memoryScore = 0; let timeScore = 0; let
      statusScore = 0;
    dataresArr.map((element) => {
      if (parseFloat(element.time) < cputimeConstraint) timeScore += 1;
      if (element.memory < memoryConstraint) memoryScore += 1;
      if (element.status.id === 3) statusScore += 1;
    });
    const weightedMemory = memoryScore * question.rubrics.memory * 0.01;
    const weightedTime = timeScore * question.rubrics.cputime * 0.01;
    const weightedStatus = statusScore * question.rubrics.status * 0.01;
    const totalWeightedScore = weightedMemory + weightedTime + weightedStatus;
    const convertedScore = (totalWeightedScore / dataresArr.length) * question.points;
    console.log('MEMORY SCORES ARE: ', weightedMemory, 'TIME: ', weightedTime, 'STATUS: ', weightedStatus, ' TOTAL IS: ', totalWeightedScore, 'CONVERTED: ', convertedScore);
    return ({
      memoryScore,
      timeScore,
      statusScore,
      weightedMemory,
      weightedTime,
      weightedStatus,
      totalWeightedScore,
      convertedScore,
    });
  } catch (error) {
    console.log(error);
  }
};

const wait = (ms = 1000) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const checkStatus = async (initialData) => {
  try {
    console.log('CHECKING STATUS....');
    const batchURLs = await initialData.map((element) => `${process.env.BETOS_JUDGE_LINK}/submissions/${element.token}`);
    console.log('URLS ARE: ', batchURLs);
    const conf = {
      'Content-Type': 'application/json',
      // 'X-RapidAPI-Key': process.env.VITE_RAPID_API_KEY,
      // 'X-RapidAPI-Host': process.env.VITE_RAPID_API_HOST,
    };
    // eslint-disable-next-line max-len
    const batchResponses = await Promise.all(batchURLs.map((url) => axios.get(url, { headers: conf })));
    const batchStatuses = batchResponses.map((e) => e.data.status.id);

    // If submission is done processing
    if ((!batchStatuses.includes(1)) && (!batchStatuses.includes(2))) {
      batchResponses.map((element) => {
        console.log('EACH RESPONSE IS ', element.data);
      });
      const datarespArr = batchResponses.map((element) => element.data);
      return (datarespArr);
      // If still processing wait 3 seconds and reprocess recursively
    }
    await wait(3000);
    return checkStatus(initialData);
  } catch (error) {
    console.log(error);
  }
};

const judgeChecking = async (cases, langId, source) => {
  // Format submission data for judge0
  console.log('WHAT DO CASES LOOOK LIKE: ', cases);
  const subs = await cases.map((element) => (
    {
      language_id: langId,
      source_code: source,
      stdin: element.input,
      expected_output: element.output,
    }));
  const judgeSubmissions = { submissions: subs };
  console.log('DATA LOOKS LIKE THIS: ', judgeSubmissions);
  const url = `${process.env.BETOS_JUDGE_LINK}/submissions/batch/`;
  const conf = {
    'Content-Type': 'application/json',
    // 'X-RapidAPI-Key': process.env.VITE_RAPID_API_KEY,
    // 'X-RapidAPI-Host': process.env.VITE_RAPID_API_HOST,
  };

  // Initial Call for judge0
  try {
    const { data } = await axios.post(url, judgeSubmissions, { headers: conf });
    const judgeResponses = await checkStatus(data);
    console.log('JUDGE RESPONSES ARE NOW: ', judgeResponses);
    return judgeResponses;
  } catch (error) {
    console.log(error);
  }
};

const autocheck = async (answerData, langId) => {
  const question = await getQuestion(answerData.questionId);
  const testo = await judgeChecking(question.testcase, langId, answerData.code);
  const score = await getScore(testo, question);
  return score;
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

export const addAllAnswer = async (req, res, next) => {
  // autocheck(req);
  console.log('THIS IS THE DATA ', req.body);
};
