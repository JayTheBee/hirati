import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';

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

function RubricMethodDetails({ rubricMethod }) {
  if (rubricMethod === 'io-check') {
    return (<b>Input Output Tests</b>);
  } if (rubricMethod === 'keyword-check') {
    return (<b>Keyword Checking</b>);
  } if (rubricMethod === 'loc-check') {
    return (<b>Line of Codes Checking</b>);
  }
}

function RubricDetails({ rubrics, testcase, answerId }) {
  const [rubricEdit, setRubricEdit] = useState(false);
  const [rubricData, setRubricData] = useState(rubrics);

  const handleRubricEdit = () => {
    setRubricEdit(!rubricEdit);
  };

  const handleRubricChange = (rubricId, field, value) => {
    const updatedRubrics = rubricData.map((rubric) => {
      if (rubric._id === rubricId) {
        return { ...rubric, [field]: value };
      }
      return rubric;
    });
    setRubricData(updatedRubrics);
  };

  const saveRubricChanges = (rubricId, rubricTitle, rubricRating) => {
    // Make the Axios call to update the rubric in the database
    axios
      .post(`/api/answer/updateRubric/${answerId}`, { rubricId, rubricTitle, rubricRating })
      .then((response) => {
        // Handle successful response
        console.log('RUBRIC CHANGED  SUCCESSFULLY. ANSWER: ', response.data);
        setRubricEdit(false); // Disable editing mode
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  return (
    <>
      <h3 className="card-title fw-bolder text-muted" style={{ textShadow: '2px 2px 1px black' }}>
        RUBRICS:
        {' '}
      </h3>
      {rubricData.map((each) => (
        <div key={each._id}>
          <h3>
            RUBRIC TITLE:
            {' '}
            {rubricEdit ? (
              <input
                type="text"
                value={each.rubricTitle}
                onChange={(e) => handleRubricChange(each._id, 'rubricTitle', e.target.value)}
              />
            ) : (
              <b>{each.rubricTitle}</b>
            )}

          </h3>
          <h3>
            RUBRIC SCORE IS:
            {' '}
            {rubricEdit ? (
              <input
                type="text"
                value={each.rubricRating}
                onChange={(e) => handleRubricChange(each._id, 'rubricRating', e.target.value)}
              />
            ) : (
              <b>{each.rubricRating}</b>
            )}
          </h3>
          <h3>
            RUBRIC METHOD IS:
            {' '}
            {rubricEdit ? (
              <input
                type="text"
                value={each.rubricMethod}
                onChange={(e) => handleRubricChange(each._id, 'rubricRating', e.target.value)}
              />
            ) : (
              <RubricMethodDetails rubricMethod={each.rubricMethod} />
            )}
          </h3>

          {rubricEdit && (
          <button type="submit" onClick={() => saveRubricChanges(each._id, each.rubricTitle, each.rubricRating)}>
            Save Changes
          </button>
          )}
          <button type="submit" onClick={handleRubricEdit}>{rubricEdit ? 'Cancel' : 'Edit'}</button>

          {each.rubricMethod === 'io-check' ? <TestcaseDetails testcase={testcase} /> : null }
        </div>
      ))}
    </>
  );
}

function AnswerDetails({ answer, testcase, lang }) {
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

          <div className="container bg-white p-4" style={{ borderRadius: '20px' }}>
            <h3 className="text-black fs-4">
              SOURCE CODE:
            </h3>
            <Editor
              height="25vh"
        // width="40vw"
              options={{ readOnly: true }}
              language={lang}
              value={each.code}
              theme="light"
            />
          </div>
          <h3>
            SCORES:
            {' '}
          </h3>
          <RubricDetails rubrics={each.rubricAdditional} testcase={testcase} answerId={each._id} />

        </div>
      ))}
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
        <div key={each._id} className="card d-flex p-4 border-4 border-dark flex-nowrap mx-auto" style={{ maxWidth: '500px', borderRadius: '50px', backgroundColor: 'rgba(181, 212, 200, 0.363)' }}>
          <div className="card-body ">
            <h2 className="card-title fw-bolder text-warning" style={{ textShadow: '2px 2px 1px black' }}>
              Question
              {' '}
              <b>
                {each.questionCount}
              </b>
              :
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
            {/* <h3 className="card-title fw-bolder text-muted" style={{ textShadow: '2px 2px 1px black' }}>
              TESTCASES:
              {' '}
            </h3>
            <TestcaseDetails testcase={each.testcase} /> */}
            <br />
            <h3 className="card-title fw-bolder text-warning" style={{ textShadow: '2px 2px 1px black' }}>
              Total Points:
              {' '}
              <b>{each.points}</b>
              {' '}
              pts.
            </h3>
            <button type="button" onClick={() => getAnswers(each._id)} className="btn btn-success rounded-pill text-white text-center fs-4">Get Answers</button>
            {answer && <AnswerDetails answer={answer} testcase={each.testcase} lang={each.language} />}
          </div>
        </div>
      ))}
    </>
  );
}

function Scoring() {
  const [question, setQuestion] = useState([]);
  const params = useParams();

  const getPoints = (questionArr) => {
    const eachPoint = [];
    questionArr.forEach((eachQuestion) => {
      let QuesPoints = 0;
      eachQuestion.rubricAdditional.forEach((eachRubric) => QuesPoints += eachRubric.rubricRating);
      eachPoint.push({ ...eachQuestion, points: QuesPoints });
    });
    return eachPoint;
  };

  const getQuestions = async () => {
    try {
      const questionResp = await axios.get(`/api/question/${params.id}`);
      console.log('QUESTIONS ARE: ', questionResp.data);
      const realQuestions = getPoints(questionResp.data);
      setQuestion(realQuestions);
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

      <h1 className="text-center fw-bold text-success" style={{ textShadow: '2px 2px 1px black' }}>CHECK THE STUDENT TASKS</h1>
      <div className="container row gap-4">
        {/* <div className="card col-sm"> */}
        {question && <QuestionDetails question={question} />}
        {/* </div> */}

      </div>
    </>
  );
}

export default Scoring;
