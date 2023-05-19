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

// const getTaskId = async (questionId) => {
//   try {
//     const question = await Question.findById({ _id: questionId });
//     console.log('TaskID IS: ', question.taskId);
//     return (question.taskId);
//   } catch (err) {
//     return (console.log(err));
//   }
// };

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
  autocheck(questionData, req.body.id);
  //  for uncomment later
  console.log('THIS IS THE DATABASE DATA: ', questionData);
  const newAnswer = new Answer(questionData);
  try {
    // autocheck(req.body);
    const userClass = await newAnswer.save();
    return res.status(200).json(userClass);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const wait = (ms = 1000) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const getScores = async (respArr) => {

  // EACH RESPONSE IS  {
  //   stdout: '1\n',
  //   time: '0.013',
  //   memory: 3168,
  //   stderr: null,
  //   token: '21b2681b-d11d-469c-b24f-662819a7ce66',
  //   compile_output: null,
  //   message: null,
  //   status: { id: 3, description: 'Accepted' }
  // }

  // respArr.time, respArr.memory, status
}



const checkStatus = async (initialData) => {
  try {
    console.log('CHECKING STATUS....');
    const batchURLs = initialData.map((element) => `${process.env.VITE_RAPID_API_URL}/${element.token}`);
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
      // console.log('BATCH RESPONSES ARE NOW: ', batchResponses);
      batchResponses.map((element) => {
        console.log('EACH RESPONSE IS ', element.data);
      });
      const datarespArr = batchResponses.map((element) => element.data);

      // return (datarespArr);
      // If still processing wait 3 seconds and reprocess recursively
    }
    // console.log('BATCH RESPONSES ARE STILL: ', batchResponses);
    await wait(3000);
    await checkStatus(initialData);
  } catch (error) {
    console.log(error);
  }
};

const judgeChecking = async (cases, language_id, source_code) => {
  // Format submission data for judge0
  console.log('WHAT DO CASES LOOOK LIKE: ', cases);
  const subs = await cases.map((element) => (
    {
      language_id,
      source_code,
      stdin: element.input,
      expected_output: element.output,
    }));
  console.log('SUBS LOOK LIKE THIS: ', subs);
  const judgeSubmissions = { submissions: subs };
  const url = `${process.env.VITE_RAPID_API_URL}/batch`;
  const conf = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': process.env.VITE_RAPID_API_KEY,
    'X-RapidAPI-Host': process.env.VITE_RAPID_API_HOST,
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

const autocheck = async (answerData, langId) => {
  // const questionData = {
  //   code: req.body.code,
  //   userId: req.user.id,
  //   questionId: req.body.questionId,
  //   code_tokens: req.body.code_tokens,
  //   resultAnswer: {
  //     cputime: req.body.time,
  //     memory: req.body.memory,
  //     status: req.body.status,
  //   },
  // };

  const question = await getQuestion(answerData.questionId);
  await judgeChecking(question.testcase, langId, answerData.code);
};

// export const createAllAnswers = async (req, res, next) => {
//   // ARRAY OF THIS v
//   //         taskId: task_id,
//   //         questionId,
//   //         source_code: response.data.source_code, base64
//   //         code_tokens: [string] source code tokenized as words
//   //         lint results:

//   try {
//     // DITO ang auto checking function
//     autocheck(req.body);

//     const dataArray = req.body; // Assuming the array is sent in the request body

//     // Iterate over the array and save each item to the database
//     for (const data of dataArray) {
//       const newData = new DataModel(data);
//       await newData.save();
//     }

//     res.status(201).json({ message: 'Data inserted successfully.' });
//   } catch (err) {
//     console.error('Error inserting data:', err);
//     res.status(500).json({ error: 'An error occurred.' });
//   }
// };
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
