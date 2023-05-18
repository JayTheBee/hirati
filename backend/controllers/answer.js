/* eslint-disable import/prefer-default-export */
import axios from 'axios';
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

export const testingEndpoint = async (req, res, next) => {
  try {
    console.log('PUTANG INA MO');
    // autocheck()
    return res.status(200).json({ message: 'jonjeng' });
  } catch (err) {
    return next(err);
  }
};

// user main function -> Answer to db with automatic check
export const createAnswer = async (req, res, next) => {
  // pa log kung nalilito naka dummy data na yan
  console.log(req.body);
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

  // automatedChecking(questionData);
  //  for uncomment later
  const newAnswer = new Answer(questionData);
  try {
    const userClass = await newAnswer.save();
    return res.status(200).json(userClass);
  } catch (err) {
    console.log(err);
    return next(err);
  }

  // Test Dev Box
  // automatedChecking( );
};

export const addAllAnswer = async (req, res, next) => {
  const addAll = req.body;
};

const wait = (ms = 1000) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const checkStatus = async (initialData) => {
  try {
    console.log('CHECKING STATUS....');
    const batchURLs = initialData.map((element) => `${import.meta.env.VITE_JUDGE_LINK}/submissions/${element.token}`);
    console.log('URLS ARE: ', batchURLs);
    const batchResponses = await Promise.all(batchURLs.map((url) => axios.get(url)));
    const batchStatuses = batchResponses.map((e) => e.data.status.id);

    // If submission is done processing
    if ((!batchStatuses.includes(1)) && (!batchStatuses.includes(2))) {
      console.log('BATCH RESPONSES ARE NOW: ', batchResponses);
      return (batchResponses);
      // If still processing wait 3 seconds and reprocess recursively
    }
    console.log('BATCH RESPONSES ARE STILL: ', batchResponses);
    await wait(3000);
    await checkStatus(initialDatah);
  } catch (error) {
    console.log(error);
  }
};

const judgeChecking = async (cases, language, source_code) => {
  // Format submission data for judge0
  const subs = cases.map((element) => (
    {
      language_id: language.id,
      source_code,
      stdin: element.input,
      expected_output: element.output,
    }));

  const judgeSubmissions = { submissions: subs };
  const url = `${import.meta.env.VITE_RAPID_API_URL}/submissions/batch`;
  const conf = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
    'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST,
  };

  // Initial Call for judge0
  try {
    const { data } = await axios.post(url, judgeSubmissions, { headers: conf });
    const judgeResponses = checkStatus(data);
    console.log('JUDGE RESPONSES ARE NOW: ', judgeResponses);
    return judgeResponses;
  } catch (error) {
    console.log(error);
  }
};

const autocheck = (answerData) => {
  answerData.forEach((each) => {
    const question = getQuestion(each.questionId);
    const judgeResults = judgeChecking(question.testcase, question.language, each.source_code);
  });
};

export const createAllAnswers = async (req, res, next) => {
  const dummyData = [
    {
      time: '0.028',
      language: 'JavaScript',
      id: 63,
      status: 'Runtime Error (NZEC)',
      memory: 7264,
      code: "print('yaw')",
      answerFlag: true,
      code: "print('yawa23')",
      questionId: '6463a275e6c8ecb5d4beb5eb',
    },
    {
      time: '0.028',
      language: 'JavaScript',
      id: 63,
      status: 'Runtime Error (NZEC)',
      memory: 7264,
      code: "print('yaw')",
      answerFlag: true,
      code: "print('yawa23')",
      questionId: '6463a275e6c8ecb5d4beb5eb',
    },
  ];

  // ARRAY OF THIS v
  //         taskId: task_id,
  //         questionId,
  //         source_code: response.data.source_code, base64
  //         code_tokens: [string] source code tokenized as words
  //         lint results:

  try {
    // DITO ang auto checking function
    autocheck(req.body);

    const dataArray = req.body; // Assuming the array is sent in the request body

    // Iterate over the array and save each item to the database
    for (const data of dataArray) {
      const newData = new DataModel(data);
      await newData.save();
    }

    res.status(201).json({ message: 'Data inserted successfully.' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'An error occurred.' });
  }
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
