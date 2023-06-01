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

export const updateRubric = async (req, res, next) => {
  try {
    const { answerId } = req.params;
    const { rubricId, rubricRating, rubricTitle } = req.body;

    const answer = await Answer.findById({ _id: answerId });
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    const rubricAdditionalIndex = answer.rubricAdditional.findIndex(
      (rubric) => rubric._id.toString() === rubricId,
    );
    if (rubricAdditionalIndex === -1) {
      return res.status(404).json({ error: 'RubricAdditional not found' });
    }

    answer.rubricAdditional[rubricAdditionalIndex].rubricRating = rubricRating;
    answer.rubricAdditional[rubricAdditionalIndex].rubricTitle = rubricTitle;
    const resAnswer = await answer.save();
    return res.status(200).json(resAnswer);
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
    taskId: req.body.taskId,
    code_tokens: req.body.code_tokens,
    resultAnswer: {
      cputime: req.body.time,
      memory: req.body.memory,
      status: req.body.status,
    },
  };
  questionData.rubricAdditional = await autocheck(questionData, req.body.id);
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
    const totalScore = timeScore + memoryScore + statusScore;
    return totalScore;
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
      'X-RapidAPI-Key': process.env.VITE_RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.VITE_RAPID_API_HOST,
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
  console.log('WHY IS URL LIKE THAT', url);
  const conf = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': process.env.VITE_RAPID_API_KEY,
    'X-RapidAPI-Host': process.env.VITE_RAPID_API_HOST,
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

const keywordCheck = (source, langId, total, keywords) => {
  const words = source.match(/[a-zA-Z]+/g) || [];
  const detected = keywords.filter((element) => !words.includes(element));
  return total - detected.length;
};

const locCheck = (source, langId, total) => {
  if (langId === 71) {
    return total;
  }
  let mistakes = 0;
  const lines = source.split('\n');
  lines.forEach((each) => {
    const semicolonCount = each.split(';').length - 1;
    semicolonCount > 1 ? mistakes += 1 : null;
  });
  return total - mistakes;
};

const checkRubric = async (question, langId, source) => {
  console.log('WHAT DOES QUESTION LOOK LIKE: ', question);
  const rubricAdditional = [];
  let rubricElement;
  let rating;

  switch (question.rubricAdditional[0].rubricMethod.value) {
    case 'keyword-check':
      rating = keywordCheck(source, langId, question.rubricAdditional[0].rubricRating, question.keywords);
      rubricElement = { rubricTitle: question.rubricAdditional[0].rubricTitle, rubricRating: rating, rubricMethod: question.rubricAdditional[0].rubricMethod.value };
      rubricAdditional.push(rubricElement);
      break;
    case 'loc-check':
      rating = locCheck(source, langId, question.rubricAdditional[0].rubricRating);
      rubricElement = { rubricTitle: question.rubricAdditional[0].rubricTitle, rubricRating: rating, rubricMethod: question.rubricAdditional[0].rubricMethod.value };
      rubricAdditional.push(rubricElement);
      break;
    case 'io-check':
      const testo = await judgeChecking(question.testcase, langId, source);
      const score = await getScore(testo, question);
      rubricElement = { rubricTitle: question.rubricAdditional[0].rubricTitle, rubricRating: score, rubricMethod: question.rubricAdditional[0].rubricMethod.value };
      rubricAdditional.push(rubricElement);
      break;
    default:
      console.log('ERROR IN RUBRIC CHECKING');
      break;
  }

  if (question.rubricAdditional.length == 2) {
    switch (question.rubricAdditional[1].rubricMethod.value) {
      case 'keyword-check':
        rating = keywordCheck(source, langId, question.rubricAdditional[1].rubricRating, question.keywords);
        rubricElement = { rubricTitle: question.rubricAdditional[1].rubricTitle, rubricRating: rating, rubricMethod: question.rubricAdditional[1].rubricMethod.value };
        rubricAdditional.push(rubricElement);
        break;
      case 'loc-check':
        rating = locCheck(source, langId, question.rubricAdditional[1].rubricRating);
        rubricElement = { rubricTitle: question.rubricAdditional[1].rubricTitle, rubricRating: rating, rubricMethod: question.rubricAdditional[1].rubricMethod.value };
        rubricAdditional.push(rubricElement);
        break;
      case 'io-check':
        const testo = await judgeChecking(question.testcase, langId, source);
        const score = await getScore(testo, question);
        rubricElement = { rubricTitle: question.rubricAdditional[1].rubricTitle, rubricRating: score, rubricMethod: question.rubricAdditional[1].rubricMethod.value };
        rubricAdditional.push(rubricElement);
        break;
      default:
        console.log('ERROR IN RUBRIC CHECKING');
        break;
    }
  }

  if (question.rubricAdditional.length == 3) {
    switch (question.rubricAdditional[2].rubricMethod.value) {
      case 'keyword-check':
        rating = keywordCheck(source, langId, question.rubricAdditional[2].rubricRating, question.keywords);
        rubricElement = { rubricTitle: question.rubricAdditional[2].rubricTitle, rubricRating: rating, rubricMethod: question.rubricAdditional[2].rubricMethod.value };
        rubricAdditional.push(rubricElement);
        break;
      case 'loc-check':
        rating = locCheck(source, langId, question.rubricAdditional[2].rubricRating);
        rubricElement = { rubricTitle: question.rubricAdditional[2].rubricTitle, rubricRating: rating, rubricMethod: question.rubricAdditional[2].rubricMethod.value };
        rubricAdditional.push(rubricElement);
        break;
      case 'io-check':
        const testo = await judgeChecking(question.testcase, langId, source);
        const score = await getScore(testo, question);
        rubricElement = { rubricTitle: question.rubricAdditional[2].rubricTitle, rubricRating: score, rubricMethod: question.rubricAdditional[2].rubricMethod.value };
        rubricAdditional.push(rubricElement);
        break;
      default:
        console.log('ERROR IN RUBRIC CHECKING');
        break;
    }
  }
  console.log('RUBRIC ADDITIONAL IS NOW: ', rubricAdditional);
  return rubricAdditional;
};

const autocheck = async (answerData, langId) => {
  const question = await getQuestion(answerData.questionId);
  const rubricAdditional = await checkRubric(question, langId, answerData.code);

  return rubricAdditional;
};

export const addAllAnswer = async (req, res, next) => {
  // autocheck(req);
  console.log('THIS IS THE DATA ', req.body);
};

export const getAllQuestionByTask = async (req, res, next) => {
  try {
    const answers = await Answer.find({ taskId: req.params.taskId, userId: req.user.id });
    return res.status(200).json(answers);
  } catch (err) {
    console.log(err);
  }
};
