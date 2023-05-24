import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TestcaseDetails({ testcase }) {
  return (
    <div className="container">
      {/* <div className="row d-flex mx-auto">
          <h3 className="col-8">
            WEIGHT OF CPUTIME IS:
          </h3>
          <h3 className="col-4">
            {' '}
            {metric?.cputime}
            %
          </h3>
        </div> */}
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
function RubricsAdditional({ rubAdd, answerId }) {
  const [rubricData, setRubricData] = useState(rubAdd);
  console.log('WHAT IS RUBADD', rubAdd)
  const handleRubricChange = (index, value) => {
    setRubricData((prevData) => {
      const newData = [...prevData];
      newData[index] = value;
      return newData;
    });
  };
  const handleSubmit = async () => {
    try {
      // Make API call to update rubric ratings in the database
      await axios.post(`/api/answers/update/${answerId}`, {
        rubricData,
      });
      console.log('Rubrics ratings updated successfully!');
    } catch (error) {
      console.log('Error updating rubrics ratings:', error);
    }
  };

  return (
    <div className="container">
      {rubAdd.map((each, index) => (
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
            <input
              type="text"
              value={rubricData[index] || each.rubricRating}
              onChange={(e) => handleRubricChange(index, e.target.value)}
            />
          </h3>
        </div>
      ))}
      <button type="button" onClick={handleSubmit} className="btn btn-primary">Submit Checks</button>
    </div>
  );
}

function AnswerDetails({ answer, rubAdd }) {
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async (userId) => {
      try {
        const { data } = await axios.get(`/api/users/${userId}`);
        console.log('USER INFO IS: ', data);
        setUserInfo((prevUserInfo) => [...prevUserInfo, data]);
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch user info for each answer
    answer.forEach((each) => {
      fetchUserInfo(each.userId);
    });
  }, [answer]);

  return (
    <>
      {answer.map((each, index) => (
        <div key={each._id}>
          <h3>
            STUDENT NAME IS:
            {' '}
            {userInfo[index]?.name}
          </h3>
          <h3>
            SOURCE CODE:
            {' '}
            <b>{each.code}</b>
          </h3>
          <h3>
            SCORES:
            {' '}
            <AutoScoreDetails autoScores={each.score} />
          </h3>
          <RubricsAdditional rubAdd={rubAdd} answerId = {each._id}/>
        </div>
      ))}
    </>
  );
}

function MetricDetails({ metric }) {
  return (
    <div className="container">
      <div className="row d-flex mx-auto">
        <h3 className="col-8">
          WEIGHT OF CPUTIME IS:
        </h3>
        <h3 className="col-4">
          {' '}
          {metric?.cputime}
          %
        </h3>
      </div>

      <div className="row d-flex mx-auto">
        <h3 className="col-8">
          WEIGHT OF MEMORY IS:
        </h3>
        <h3 className="col-4">
          {' '}
          {metric?.memory}
          %
        </h3>
      </div>

      <div className="row d-flex mx-auto">
        <h3 className="col-8">
          WEIGHT OF STATUS IS:
        </h3>
        <h3 className="col-4">
          {' '}
          {metric?.status}
          %
        </h3>
      </div>
    </div>
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
        <div key={each._id} className="card d-flex p-4 border-4 border-dark flex-nowrap mx-auto" style={{ maxWidth: '500px', borderRadius: '50px', backgroundColor: 'rgba(181, 212, 200, 0.363)' }}>
          <div className="card-body ">
            <h2 className="card-title fw-bolder text-warning" style={{ textShadow: '2px 2px 1px black' }}>
              Question
              {' '}
              <b>
                {each.questionCount}
              </b>
              {' '}
              Meta:
              {' '}
            </h2>
            <h3 className="card-title fw-bolder text-muted" style={{ textShadow: '2px 2px 1px black' }}>
              DESCRIPTION:
              {' '}
            </h3>
            <h4 style={{ whiteSpace: 'pre-wrap' }}>{each.description}</h4>
            <h3 className="card-title fw-bolder text-muted" style={{ textShadow: '2px 2px 1px black' }}>
              LANGUAGE:
              {' '}
            </h3>
            <h2>{each.language}</h2>
            <br />
            <h3 className="card-title fw-bolder text-muted" style={{ textShadow: '2px 2px 1px black' }}>
              METRICS:
            </h3>
            <MetricDetails metric={each.rubrics} />
            <br />
            <h3 className="card-title fw-bolder text-muted" style={{ textShadow: '2px 2px 1px black' }}>
              TESTCASES:
              {' '}
            </h3>
            <TestcaseDetails testcase={each.testcase} />
            <br />
            <h3 className="card-title fw-bolder text-warning" style={{ textShadow: '2px 2px 1px black' }}>
              Total Points:
              {' '}
              <b>{each.points}</b>
              {' '}
              pts.
            </h3>
            <button type="button" onClick={() => getAnswers(each._id)} className="btn btn-success rounded-pill text-white text-center fs-4">Get Answers</button>
            {answer && <AnswerDetails answer={answer} rubAdd={each.rubricAdditional} />}
          </div>
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

      <h1 className="text-center fw-bold text-success" style={{ textShadow: '2px 2px 1px black' }}>TEACHER CHECKING VIEW</h1>
      <div className="container row gap-4">
        {/* <div className="card col-sm"> */}
        {question && <QuestionDetails question={question} />}
        {/* </div> */}

      </div>
    </>
  );
}

export default Scoring;
