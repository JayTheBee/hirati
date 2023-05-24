import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import { set } from 'mongoose';
const userData = JSON.parse(localStorage.getItem('user'));
function TestcaseDetails({ testcase }) {
  return (
    <div className="container">
      {testcase.map((each, index) => (
        <div key={each._id} className="row d-flex mx-auto">
          <h4 className="fw-bolder text-muted" style={{ textShadow: '2px 2px 1px black' }}>
            CASE
            {' '}
            {index + 1}
            {' '}
            #
          </h4>

          <h3 className="col-4">
            INPUT:
          </h3>
          <h3 className="col-8">
            {' '}
            {each.input}
          </h3>

          <h3 className="col-4">
            OUTPUT:
          </h3>
          <h3 className="col-8">
            {' '}
            {each.output}
          </h3>
        </div>
      ))}
    </div>
  );
}

function AutoScoreDetails({ autoScores }) {
  return (
    <div className="container">

      <h3>
        RAW MEMORY SCORE:
        {' '}
        {autoScores?.memoryScore}
      </h3>
      <h3>
        RAW CPU TIME SCORE:
        {' '}
        {autoScores?.timeScore}
      </h3>
      <h3>
        RAW STATUS SCORE:
        {' '}
        {autoScores?.statusScore}
      </h3>
      <h3>
        WEIGHTED MEMORY SCORE:
        {' '}
        {autoScores.weightedMemory.$numberDecimal.toLocaleString()}
      </h3>
      <h3>
        WEIGHTED CPU TIME SCORE:
        {' '}
        {autoScores.weightedTime.$numberDecimal.toLocaleString()}
      </h3>
      <h3>
        WEIGHTED STATUS SCORE:
        {' '}
        {autoScores.weightedStatus.$numberDecimal.toLocaleString()}
      </h3>
      <h3>
        TOTAL WEIGHTED SCORE:
        {' '}
        {autoScores.totalWeightedScore.$numberDecimal.toLocaleString()}
      </h3>
      <h3>
        FINAL SCORE:
        {' '}
        {autoScores.convertedScore.$numberDecimal.toLocaleString()}
      </h3>
    </div>
  );
}
function RubricsAdditional({ rubAdd }) {
  return (
    <div className="container">
      {rubAdd.length ? rubAdd.map((each, index) => (
        <div key={each._id} className="row d-flex mx-auto">
          <h4 className="fw-bolder text-muted" style={{ textShadow: '2px 2px 1px black' }}>
            RUBRIC
            {' '}
            {index + 1}
            {' '}
            #
          </h4>

          <h3 className="col-4">
            RUBRIC NAME:
            {' '}
            {each.rubricTitle}
          </h3>
          <br />
          <h3 className="col-8">
            RUBRIC RATING:
            {' '}
            {each.rubricRating}
          </h3>
        </div>
      )) : <b className=" fs-3 mx-auto">No  additional rubrics added</b>}
      <br />

    </div>
  );
}

function codeDetails({ answer }) {
  console.log('WHAT THE FUCKK IS THIS ', answer);
  return (
    <div key={answer?._id}>

      <h3>
        SOURCE CODE:
        {' '}
        <b>{answer?.code}</b>
      </h3>
      <h3>
        SCORES:
        {' '}
        <AutoScoreDetails autoScores={answer?.score} />
      </h3>
      <RubricsAdditional rubAdd={answer?.rubricAdditional} />
    </div>
  );
}

const dataAnswer = [];

function Points() {
  const [question, setQuestion] = useState([]);
  const [task, setTask] = useState();
  const [answer, setAnswer] = useState([]);
  const [code, setCode] = useState();
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

  const getTask = async () => {
    console.log('GETTING TASK');
    console.log(params.id);

    try {
      const taskResp = await axios.post(`/api/tasks/${params.id}`);
      console.log('TASK IS: ', taskResp);
      setTask(taskResp.data);
      // setQuestion(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserAnswers = async () => {
    try {
      const dataAnswer = [];
      await Promise.all(
        question.map(async (each) => {
          const { data } = await axios.get(`/api/answer/user/${each._id}`);
          dataAnswer.push(data[0]);
        }),
      );
      setAnswer(dataAnswer);
      console.log('this is Answer', dataAnswer);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQuestions();
    getTask();
    getUserAnswers();
  }, []);

  return (
    <>
      <h1 className="text-center fw-bold text-success" style={{ textShadow: '2px 2px 1px black' }}>{task?.category}</h1>
      <h1 className="text-center fw-bold text-success" style={{ textShadow: '2px 2px 1px black' }}>STUDENT SCORES</h1>
      <div className="container row gap-4">
        {/* <div className="card col-sm"> */}
        {question && question.map((each, i) => (
          <div key={each._id} className="card d-flex p-4 border-4 border-dark flex-nowrap mx-auto" style={{ maxWidth: '500px', borderRadius: '50px', backgroundColor: 'rgba(181, 212, 200, 0.363)' }}>
            <div className="card-body ">
              <h2 className="card-title fw-bolder text-warning" style={{ textShadow: '2px 2px 1px black' }}>
                Question
                {' '}
                <b>
                  {each.questionCount}
                </b>
                :
                {' '}
              </h2>
              <h3 className="card-title fw-bolder text-muted" style={{ textShadow: '2px 2px 1px black' }}>
                DESCRIPTION:
                {' '}
              </h3>
              <h4 style={{ whiteSpace: 'pre-wrap' }}>{each.description}</h4>

              <br />
              <h3 className="card-title fw-bolder text-warning" style={{ textShadow: '2px 2px 1px black' }}>
                Total Points:
                {' '}
                <b>{each.points}</b>
                {' '}
                pts.
              </h3>
              <h3 className="card-title fw-bolder text-warning mt-5" style={{ textShadow: '2px 2px 1px black' }}>
                Code:
              </h3>

              <b className=" fs-3 mx-auto">
                {answer.length > 0 && answer[i] && <pre>{answer[i].code}</pre>}
              </b>
              <h3 className="card-title fw-bolder text-warning mt-5" style={{ textShadow: '2px 2px 1px black' }}>
                Scores:
              </h3>
              <b className=" fs-3 mx-auto">
                {answer.length > 0 && answer[i]
              && <AutoScoreDetails autoScores={answer[i]?.score} />}
              </b>
              <h3 className="card-title fw-bolder text-warning mt-5" style={{ textShadow: '2px 2px 1px black' }}>
                Rubric Scores:
              </h3>
              {answer.length > 0 && answer[i]
              && <RubricsAdditional rubAdd={answer[i]?.rubricAdditional} />}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Points;
