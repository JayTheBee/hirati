import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TestcaseDetails({ testcase }) {
  return (
    <>
      {testcase.map((each, index) => (
        <div key={each._id}>
          <h2>
            CASE
            {' '}
            {index + 1}
          </h2>
          <h3>
            INPUT:
            {' '}
            <b>{each.input}</b>
          </h3>
          <h3>
            OUTPUT:
            {' '}
            <b>{each.output}</b>
          </h3>
        </div>
      ))}
    </>
  );
}

// function AnswerDetails({ answer }) {
//   return (
//     <>

//       {answer.map((each) => (
//         <div key={each._id}>
//           <h2>

//             ANSWER
//             {' '}
//             {each.answerCount}
//           </h2>

//           <h3>
//             DESCRIPTION:
//             {' '}
//             <b>{each.description}</b>
//           </h3>
//           <h3>
//             LANGUAGE:
//             {' '}
//             <b>{each.language}</b>
//           </h3>

//           <h3>
//             CODE:
//             {' '}
//             <b>{each.code}</b>
//           </h3>
//           <h3>
//             STATUS:
//             {' '}
//             <b>{each.status}</b>
//           </h3>
//           <h3>
//             SCORE:
//             {' '}
//             <b>{each.score}</b>
//           </h3>
//         </div>
//       ))}
//     </>
//   );
// }

function MetricDetails({ metric }) {
  return (
    <>
      <h3>
        WEIGHT OF CPUTIME IS:
        {metric.cputime}
        {' '}
        %
      </h3>
      <h3>
        WEIGHT OF MEMORY IS:
        {metric.memory}
        {' '}
        %
      </h3>
      <h3>
        WEIGHT OF STATUS IS:
        {metric.status}
        {' '}
        %
      </h3>
    </>
  );
}

function QuestionDetails({ question }) {
  const [answer, setAnswer] = useState([]);

  const getAnswers = async (questionId) => {
    try {
      const { data } = await axios.get(`/api/answer/getAll/${questionId}`);
      console.log('ANSWERS ARE: ', data);
      setAnswer(data);
      // setQuestion(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {question.map((each) => (
        <div key={each._id}>
          <h2>
            Question
            {' '}
            <b>
              {each.questionCount}
            </b>
            {' '}
            Meta:
            {' '}
          </h2>
          <h3>
            DESCRIPTION:
            {' '}
            <b>{each.description}</b>
          </h3>
          <h3>
            LANGUAGE:
            {' '}
            <b>{each.language}</b>
          </h3>
          <br />
          <h3>
            METRICS ARE:
            <MetricDetails metric={each.rubrics} />
          </h3>
          <br />
          <h3>
            TESTCASES:
            {' '}
            <TestcaseDetails testcase={each.testcase} />
          </h3>
          <br />
          <h3>
            Total Points:
            {' '}
            <b>{each.points}</b>
          </h3>
          <button type="button" onClick={() => getAnswers(each._id)}>Get Answers</button>
        </div>
      ))}
    </>
  );
}

function Scoring() {
  const [question, setQuestion] = useState([]);
  const params = useParams();

  const getQuestions = async () => {
    try {
      const questionResp = await axios.get(`/api/question/${params.id}`);
      console.log('QUESTIONS ARE: ', questionResp.data);
      setQuestion(questionResp.data);
      // setQuestion(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);
  return (
    <>
      <h1>TEACHER CHECKING VIEW</h1>
      {question && <QuestionDetails question={question} />}
      ;
    </>
  );
}

export default Scoring;
