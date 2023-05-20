/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';

import {
  AiFillDelete,
  AiFillEdit,
  AiFillFileAdd,
  AiOutlineCloseCircle,
} from 'react-icons/ai';
import toast from 'react-hot-toast';
import { BiCuboid } from 'react-icons/bi';
import question from '../../resource/question.png';
import KeywordsDropdown from './keywordsDropdown';
import classes from './TaskItem.module.scss';
import Editor from '../editor/QuestionEditor';
import AnswerButtonSubmit from '../answer/Answer';

let editorData = {};
let keywordData = [];
let currentEdit = 0;

function TaskItem({
  task, deleteTask, updateButtonClick, count,
}) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [viewStackmodal, setviewStackmodal] = React.useState(false);
  const [editStackModal, setEditStackModal] = React.useState(false);
  const [modalTakeExam, setTakeExam] = React.useState(false);
  const [toggleCondition, setToggleCondition] = React.useState(true);
  const [viewSample, setViewSample] = React.useState(false);
  const [permission, setPermission] = React.useState(false);
  const [counter, setCount] = React.useState(1);
  const [inputBox, setInputBox] = React.useState([{ input: '', output: '' }]);
  const [rubricBox, setRubricBox] = React.useState([
    { rubricTitle: '', rubricRating: '' },
  ]);
  const [data, setData] = React.useState([]);
  const answerData = [{}];
  const userData = JSON.parse(localStorage.getItem('user'));
  // All data Stored for db submission
  let collateData = [];

  // let editorData = {};

  // View all in stack modal fetch existing question from db if meron

  function truncate(str, n) {
    return str.length > n ? `${str.slice(0, n - 1)}...` : str;
  }

  async function deleteQuestionStack(eachData) {
    console.log(eachData);
    if (Object.prototype.hasOwnProperty.call(eachData, 'questionId')) {
      await axios.delete(`/api/question/${eachData.questionId}`);
    }
    setData(data.filter((each) => each.count !== eachData.count));
    setCount(counter - 1);
    toast.success(`Question #${eachData.count} is deleted`);
  }

  // for inputbox Testcase functions
  const inputBoxAdd = () => {
    if (inputBox.length < 5) {
      setInputBox([...inputBox, { input: '', output: '' }]);
    } else {
      toast.error('cannot set Test cases more than 5');
    }
  };

  const inputBoxChange = (e, i) => {
    const { name, value } = e.target;
    const onchangeVal = [...inputBox];
    onchangeVal[i][name] = value;
    setInputBox(onchangeVal);
    console.log(inputBox);
  };

  const inputBoxDelete = (i) => {
    const deleteVal = [...inputBox];
    deleteVal.splice(i, 1);
    setInputBox(deleteVal);
    console.log(inputBox);
  };

  const inputEditorAdd = async (index, field) => {
    const temp = data;
    if (field == 'testcase') {
      temp[index].testcase.push({ input: '', output: '' });
    } else {
      temp[index].rubrics.push({ rubricTitle: '', rubricRating: '' });
    }
    setData(temp);
    setEditStackModal(false);
    await new Promise((resolve) => setTimeout(resolve, 1));
    console.log(data);
    setEditStackModal(true);
  };

  const inputEditorDelete = async (index, pos, field) => {
    const temp = data;
    temp[index][field].splice(pos, 1);
    setData(temp);
    setEditStackModal(false);
    await new Promise((resolve) => setTimeout(resolve, 1));
    setEditStackModal(true);
  };

  const inputEditorChange = (e, index, pos, field) => {
    const { name, value } = e.target;
    const temp = data;
    temp[index][field][pos][name] = value;
    console.log(temp);
  };

  // for inputbox Testcase functions enddddddd

  const rubricBoxAdd = () => {
    if (rubricBox.length < 5) {
      setRubricBox([...rubricBox, { rubricTitle: '', rubricRating: '' }]);
    } else {
      toast.error('cannot set Additional  Rubrics');
    }
  };

  const rubricBoxChange = (e, i) => {
    const { name, value } = e.target;
    const onchangeVal = [...rubricBox];
    onchangeVal[i][name] = value;
    setRubricBox(onchangeVal);
    console.log(rubricBox);
  };
  const rubricBoxDelete = (i) => {
    const deleteVal = [...rubricBox];
    deleteVal.splice(i, 1);
    setRubricBox(deleteVal);
    console.log(rubricBox);
  };

  function handleKeywords(e) {
    keywordData = Array.isArray(e) ? e.map((x) => x.value) : [];
    if (keywordData.length > 0) {
      // handleChangeEditModal(keywordData,'keywords', )
      console.log(keywordData);
    }
  }

  useEffect(() => {
    console.log('run');
    setData(collateData);
  }, []);

  const inputRef = useRef();
  const outputRef = useRef();
  const cputimeRef = useRef();
  const memoryRef = useRef();
  const statusRef = useRef();
  const pointsRef = useRef();
  const descriptionRef = useRef();

  // modal edit ref
  const cputimeEditRef = useRef();
  const memoryEditRef = useRef();
  const statusEditRef = useRef();

  const clearRubrics = () => {
    if (toggleCondition) {
      statusRef.current.value = '';
      memoryRef.current.value = '';
      cputimeRef.current.value = '';
      pointsRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const res = e.currentTarget.value === 'true';
    console.log(res);
    setToggleCondition(res);
    res
      ? (statusRef.current.style.backgroundColor = 'white')
      : (statusRef.current.style.backgroundColor = 'gray');
    res
      ? (memoryRef.current.style.backgroundColor = 'white')
      : (memoryRef.current.style.backgroundColor = 'gray');
    res
      ? (cputimeRef.current.style.backgroundColor = 'white')
      : (cputimeRef.current.style.backgroundColor = 'gray');
    res
      ? (pointsRef.current.style.backgroundColor = 'white')
      : (pointsRef.current.style.backgroundColor = 'gray');

    clearRubrics();
  };

  const openUpdateform = async () => {
    updateButtonClick(task);
  };
  // print('yawa2')
  const handleEditorData = async (data, codeId) => {
    if (data.answerFlag) {
      answerData[codeId] = data;
    } else {
      editorData = data;
      React.memo(editorData);
    }
    // console.log(data);
    // console.log(data);
    console.log(editorData);
  };

  // clear all values
  const clearAllVal = () => {
    ({ language: editorData.language });
    console.log(editorData);
    setRubricBox([{ rubricTitle: '', rubricRating: '' }]);
    setInputBox([{ input: '', output: '' }]);
    descriptionRef.current.value = '';
    // inputRef.current.value = '';
    // outputRef.current.value = '';
    clearRubrics();
    // clearInput();
    // console.log(editorData);
  };
  const hasValue = (data) => {
    if (data !== null || data !== undefined) {
      return data;
    }
    return '';
  };

  const handleEditModal = (data) => {
    currentEdit = data.count;
    if (
      parseInt(data.status) + parseInt(data.cputime) + parseInt(data.memory)
			!== 100
    ) {
      toast.error(
        'Please enter valid percentage for cpu,memory and status that equates to 100%',
      );
      return;
    }
    setEditStackModal(!editStackModal);
  };

  // holy moly Dynamic update SHEESH
  const handleChangeEditModal = (e, count, field) => {
    const index = data.findIndex((each) => each.count === count);
    if (field === 'keywords') {
      data[index][field] = [];
      e.forEach((each, i) => {
        data[index][field][i] = each.value;
      });
      return;
    }

    // collateData[index][field] = e.target.value;
    data[index][field] = e.target.value;
    // // setData(collateData);
    // // dapat same sila dito ng res
    // console.log(collateData);
    console.log(data);
  };

  const closeModal = () => {
    setCount(1);
    setToggleCondition(true);
    collateData = [];
    setData([]);
    clearAllVal();
    setIsOpen(false);
  };

  const closeViewAllModal = () => {
    // logic for preventing user from closing modal while edit mode is true
    if (editStackModal == true) {
      setviewStackmodal(false);
      toast.error('Please finish Editing before closing! ');
    } else {
      setviewStackmodal(false);
    }
    // setviewStackmodal(false);
  };

  const closeExam = () => {
    setTakeExam(false);
  };

  // One instance for now -->> On going with other scenario, impelements Create when all fields are given
  const handleSubmit = () => {
    console.log(data);
    try {
      if (data.length > 0) {
        data.map(async (each) => {
          Object.prototype.hasOwnProperty.call(data, 'questionId')
            ? await axios.put('/api/question/', each)
            : await axios.post('/api/question/', each);
        });
        clearAllVal();
        toast.success('All questions in the stack are uploaded!');
        closeModal();
      } else {
        toast.error('Cannot Upload due to empty stack');
      }
    } catch (err) {
      console.log(err);
      toast.error('Something Went wrong! ');
    }
  };

  const handleAdditionalCase = () => {
    if (inputRef.current.value && outputRef.current.value) {
      if (confirm('Add additional case for this question?')) {
        additionalCase.push({
          testcase: {
            input: inputRef.current.value,
            output: outputRef.current.value,
          },
        });
        toast.success('Additional Case Added');
      }
    } else if (confirm('Push to stack with missing data in input/output ?')) {
      additionalCase.push({
        testcase: {
          input: inputRef.current.value,
          output: outputRef.current.value,
        },
      });
      toast.success('Additional Case Added');
    }
    inputRef.current.value = '';
    outputRef.current.value = '';
  };

  const checkRubricsPercentage = () => {
    if (
      toggleCondition
			&& parseInt(statusRef.current.value)
				+ parseInt(cputimeRef.current.value)
				+ parseInt(memoryRef.current.value)
				!== 100
    ) {
      return false;
    }
    return true;
  };

  const checkRequiredIfEmpty = () => {
    if (
      editorData.language === undefined
			|| descriptionRef.current.value === ''
    ) {
      toast.error('Language and Description cannot be empty');
      return true;
    }
    return false;
  };

  const checkRubricsIfEmpty = () => {
    if (
      statusRef.current.value === ''
			|| memoryRef.current.value === ''
			|| cputimeRef.current.value === ''
			|| pointsRef.current.value === ''
    ) {
      // toast.error('Memory, Points, Status and CPU time cannot be empty');
      return true;
    }
    return false;
  };

  const handleAnotherQuestion = () => {
    console.log(editorData);
    console.log(descriptionRef.current.value);

    if (checkRequiredIfEmpty()) {
      return;
    }
    if (checkRubricsIfEmpty() && toggleCondition) {
      toast.error(
        'Default Rubrics for automated Testing is enabled. Please fill all fields or disable it. ',
      );
      return;
    }
    if (!checkRubricsPercentage() && toggleCondition) {
      toast.error(
        'Please fill Rubrics Cputime, Memory and Status with whole number that equates to 100%',
      );
      return;
    }

    // Scenario 1: All rubrics are required (Enabled)
    if (toggleCondition) {
      collateData.push({
        language: editorData.language,
        description: descriptionRef.current.value,
        testcase: inputBox,
        rubrics: rubricBox,
        cputime: cputimeRef.current.value,
        memory: memoryRef.current.value,
        status: statusRef.current.value,
        points: pointsRef.current.value,
        result: editorData,
        count: counter,
        task_id: task._id,
        keywords: keywordData,
        code: editorData.code,
        permission,
      });
      console.log('scene1');
      // Scenario 2: disabled default rubric scenario and without additional set Criteria/TestCase
    } else if (!toggleCondition) {
      collateData.push({
        language: editorData.language,
        description: descriptionRef.current.value,
        testcase: inputBox,
        rubrics: rubricBox,
        result: editorData,
        task_id: task._id,
        count: counter,
        keywords: keywordData,
        code: editorData.code,
        permission,
      });
      console.log('scene2');
    } else {
      collateData.push({
        code: editorData.code,
        rubrics: rubricBox,
        testcase: inputBox,
        result: editorData,
        description: descriptionRef.current.value,
        language: editorData.language,
        task_id: task._id,
        count: counter,
        keywords: keywordData,
        permission,
      });
      console.log('scene3');
    }
    clearAllVal();
    toast.success(`Question #${counter} added to the stack!`);
    setCount(counter + 1);
    setData(collateData);
    console.log(collateData);
  };

  // Student Access to task
  const getQuestion = async (taskId) => {
    try {
      const { data } = await axios.get(`/api/question/${taskId}`);
      if (userData.role == 'teacher' && data.length > 0) {
        data.forEach((each, index) => {
          collateData.push({
            count: each.questionCount,
            language: each.language,
            cputime: each.rubrics?.cputime ?? 0,
            memory: each.rubrics?.memory ?? 0,
            status: each.rubrics?.status ?? 0,
            description: each.description,
            testcase: each.testcase,
            rubrics: each.rubricAdditional,
            keywords: [...each.keywords],
            result: {
              time: parseFloat(each.resultSample?.time.$numberDecimal ?? 0),
              status: each.resultSample?.status ?? 'not specified',
              memory: each.resultSample?.memory ?? 0,
            },
            task_id: each.taskId,
            points: each.points,
            questionId: each._id,
          });
        });
        console.log(data);
        console.log(collateData);
        setCount(data.length + 1);
        setData(collateData);
        // to make synchronous setData
        await new Promise((resolve) => setTimeout(resolve, 1));
        return;
      }
      setData(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  function openModal(taskId) {
    getQuestion(taskId);
    setIsOpen(true);
  }

  function openviewStackmodal(taskId) {
    // getQuestion(taskId);
    setviewStackmodal(true);
  }

  function openExam(taskId) {
    setTakeExam(true);
    getQuestion(taskId);
  }

  const permissionHandler = () => {
    setPermission(!permission);
  };

  const viewSampleCode = () => {
    setViewSample(!viewSample);
  };

  return (
    <tr className={classes.task_item}>
      <td>{count}</td>
      <td>
        {/* <Link to="task" state={{ classId: params.id, taskId: task._id, taskName: task.title }}> */}
        {' '}
        {task.title}
        {/* </Link> */}
      </td>
      <td>{moment(task.createdAt).calendar()}</td>
      <td>{moment(task.dateExp).format('MMMM Do YYYY, h:mm a')}</td>
      <td>{task.category}</td>

      <td
        className={
					moment().isBefore(task.dateExp) ? classes.active : classes.completed
				}
      >
        <p>{moment().isBefore(task.dateExp) ? 'Active' : 'Completed'}</p>
      </td>

      <td>
        {userData.role === 'teacher' ? (
          <div className={classes.action}>
            <button
              onClick={() => openModal(task._id)}
              type="button"
              className={classes.assignBtn}
            >
              <AiFillFileAdd />
              {' '}
              Add
            </button>

            {/* MODAL for question */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              className={classes.modal}
              overlayClassName={classes.overlay}
              contentLabel="Assign Task"
              ariaHideApp={false}
            >
              {/* modal render question */}
              <button
                onClick={closeModal}
                type="button"
                className={classes.modalClose}
              >
                X
              </button>
              <div className={classes.titleTask}>
                <h5 className="fw-bolder">Task Name</h5>

                <h1 className={classes.titleQuestion}>{` ${task.title} `}</h1>
              </div>
              <h2 className="text-center fw-bold">
                Question #
                {`${counter}`}
              </h2>
              <br />
              <h4>
                Please fill necessary details such as Language, Description and
                Sample Code. While Test Cases and Rubrics are'nt necessary,
                these are important for Automated Grading. Rubrics(Memory,
                Cputime and Status) requires to equate to a total of 100% but
                can be disabled in the event that the professor wants to
                manually check.
                {' '}
              </h4>

              <form className={classes.addNewForm} onSubmit="">
                <div className={classes.row}>
                  <div className={classes.columnInput}>
                    <div className=" w-100">
                      <label>Set Keywords:</label>
                      <KeywordsDropdown onSelectChange={handleKeywords} />
                    </div>
                    <br />
                    <div className="w-100 ">
                      <label htmlFor="description">Description:</label>
                      <textarea
                        name="description"
                        type="areatext"
                        placeholder="Enter Description . . ."
                        id="description"
                        ref={descriptionRef}
                        required
                      />
                    </div>

                    <label htmlFor="input"> Test Case: </label>
                    <button
                      onClick={inputBoxAdd}
                      className="d-block float-end m-2"
                      type="button"
                    >
                      Set Additional
                    </button>
                    <br />
                    <br />
                    {inputBox.map((val, i) => (
                      <div className="d-flex p-6 gap-2">
                        <input
                          name="input"
                          value={val.input}
                          placeholder="Input"
                          onChange={(e) => inputBoxChange(e, i)}
                        />
                        <input
                          name="output"
                          value={val.output}
                          placeholder="Output"
                          onChange={(e) => inputBoxChange(e, i)}
                        />
                        <button onClick={() => inputBoxDelete(i)}>
                          Delete
                        </button>
                      </div>
                    ))}

                    <label htmlFor="performance">
                      <br />
                      Rubrics for Automated Scoring:
                      <div>
                        <div className={classes.row}>
                          <input
                            name="cputime"
                            type="number"
                            placeholder="Cputime %"
                            id="y"
                            ref={cputimeRef}
                            defaultValue=""
                            disabled={!toggleCondition}
                            required
                          />
                          <input
                            name="memory"
                            type="number"
                            placeholder="Memory %"
                            id="memory"
                            ref={memoryRef}
                            defaultValue=""
                            disabled={!toggleCondition}
                            required
                          />
                        </div>
                        <div className={classes.row}>
                          <input
                            name="status"
                            type="number"
                            placeholder="Status %"
                            id="status"
                            ref={statusRef}
                            defaultValue=""
                            disabled={!toggleCondition}
                            required
                          />
                          <input
                            name="points"
                            type="number"
                            min="0"
                            placeholder="Total Points"
                            id="score"
                            ref={pointsRef}
                            defaultValue=""
                            disabled={!toggleCondition}
                            required
                          />
                        </div>

                        <div className={classes.row}>
                          <label className={classes.radioLabel}>
                            <input
                              type="radio"
                              id="enable"
                              value="true"
                              onChange={handleChange}
                              checked={toggleCondition === true}
                            />
                            Enable
                          </label>

                          <label className={classes.radioLabel}>
                            <input
                              type="radio"
                              id="disable"
                              value="false"
                              onChange={handleChange}
                              checked={toggleCondition === false}
                            />
                            <span />
                            Disable
                          </label>
                          <button
                            onClick={rubricBoxAdd}
                            className="d-block float-end m-2"
                            type="button"
                          >
                            Set Criteria
                          </button>
                        </div>
                        {rubricBox.map((val, i) => (
                          <div className="d-flex p-6 gap-2">
                            <input
                              name="rubricTitle"
                              value={val.rubricTitle}
                              placeholder="Rubric Title"
                              type="string"
                              onChange={(e) => rubricBoxChange(e, i)}
                            />
                            <input
                              name="rubricRating"
                              value={val.rubricRating}
                              placeholder="Rating"
                              type="number"
                              onChange={(e) => rubricBoxChange(e, i)}
                            />
                            <button type="button" onClick={() => rubricBoxDelete(i)}>
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </label>

                    <div className="container d-flex align-items-center">
                      <input
                        type="checkbox"
                        id="checkbox"
                        className="mx-3 my-auto"
                        checked={permission}
                        onChange={permissionHandler}
                        style={{ width: '20px' }}
                      />
                      <label htmlFor="checkbox" className="fs-4  my-auto"> Show Sample Code with Students </label>
                    </div>

                    <button type="button" onClick={handleAnotherQuestion}>
                      Add Question to stack
                    </button>

                    {/*  To do view all in stack */}
                    <button
                      type="button"
                      onClick={() => openviewStackmodal(task._id)}
                    >
                      View All Question in stack
                    </button>

                    {/* to do Submit all data to mongodb */}
                    <button type="button" onClick={handleSubmit}>
                      Submit All from Stack
                    </button>
                  </div>

                  <div className={classes.columnSampleCode}>
                    <Editor handleEditorData={handleEditorData} />
                  </div>
                </div>
              </form>
            </Modal>

            {/* MODAL end */}

            <button
              type="button"
              className={classes.updateBtn}
              onClick={openUpdateform}
            >
              <AiFillEdit />
              {' '}
              Edit
            </button>

            <button
              type="button"
              className={classes.deleteBtn}
              onClick={() => deleteTask(task._id)}
            >
              <AiFillDelete />
              {' '}
              Del
            </button>

            {/* this part is for view all stack for Modal question view */}

            <Modal
              isOpen={viewStackmodal}
              onRequestClose={closeViewAllModal}
              className={classes.modalViewAll}
              overlayClassName={classes.overlay}
              contentLabel="View Stack"
              ariaHideApp={false}
            >
              {/* modal render view all stack question */}
              <button
                onClick={closeViewAllModal}
                type="button"
                className="float-end btn p-4 fs-1 rounded-circle"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="close"
              >
                <AiOutlineCloseCircle />
              </button>
              <div className={classes.titleTask}>
                <h1 className={classes.titleQuestion}>
                  Question Stack -
                  {' '}
                  {` ${data.length}`}
                </h1>
              </div>
              <br />
              <h3>All Questions pushed into the stack: </h3>
              <div className={classes.containerAllQuestion}>
                {data.length > 0
								  ? data.map((each, index) => (
  <div className={classes.card}>
    <div className={classes.content}>
      <img src={question} alt="Question Logo" />
      <div className={classes.column}>
        <div className={classes.row}>
          {/* <h2>{`Question ID #${each.count}`}</h2> */}
          <h2>{`Question ID #${each.count}`}</h2>
        </div>
        <div className={classes.row}>
          <h2>Language: </h2>
          <h4>{each.language}</h4>
          {/* // )
                            // } */}
        </div>

        <div className={classes.row}>
          <h2>Description: </h2>
          {currentEdit == each.count && editStackModal ? (
            <input
              type="text"
              onChange={(event) => handleChangeEditModal(
																	    event,
																	    each.count,
																	    'description',
              )}
              defaultValue={each.description}
            />
          ) : (
            <h4>{truncate(each.description, 15)}</h4>
          )}
        </div>
        <div className={classes.row}>
          <h2>Input: </h2>
          <h2>Output: </h2>
          {currentEdit == each.count && editStackModal ? (
            <>
              <button
                onClick={() => inputEditorAdd(index, 'testcase')}
                className="d-block float-end m-2 btn btn-success rounded-pill border-1"
                type="button"
              >
                +Add
              </button>
              {each.testcase.map((e, pos) => (
                // console.log(data)
                <div className="container d-flex justify-content-end align-items-center gap-4">
                  <input
                    name="input"
                    defaultValue={e.input}
                    placeholder="Input"
                    onChange={(e) => inputEditorChange(
																				    e,
																				    index,
																				    pos,
																				    'testcase',
                    )}
                  />
                  <input
                    name="output"
                    defaultValue={e.output}
                    placeholder="Output"
                    onChange={(e) => inputEditorChange(
																				    e,
																				    index,
																				    pos,
																				    'testcase',
                    )}
                  />
                  <button
                    onClick={() => inputEditorDelete(
																				    index,
																				    pos,
																				    'testcase',
                    )}
                    type="button"
                    className="btn btn-danger border-1 border-black rounded-pill"
                  >
                    <AiFillDelete />
                  </button>
                </div>
              ))}
            </>
          ) : (
            <>
              {each.testcase.map((e, pos) => (
                // console.log(data)
                <div className="container d-flex mx-4 justify-content-between align-items-center">
                  <div className=" row">
                    <h4 className="d-inline-block text-truncate">{`${e.input} `}</h4>
                  </div>

                  <div className=" row">
                    <h4
                      className="d-inline-block text-truncate float-right"
                      max
                    >
                      {e.output}
                    </h4>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className={classes.row}>
          <h2>Keywords: </h2>
          {currentEdit == each.count && editStackModal ? (
            <div className="container w-100">
              <KeywordsDropdown
                passValue={each.keywords}
                onSelectChange={(event) => handleChangeEditModal(
																		    event,
																		    each.count,
																		    'keywords',
                )}
              />
            </div>
          ) : (
            <h4>
              {each.keywords.map((key, i) => (each.keywords.length - 1 === i
                ? `${key}`
                : `${key}, `))}
            </h4>
          )}
        </div>

        <div className={classes.row}>
          <h2>Cpu time:</h2>
          {currentEdit == each.count && editStackModal ? (
            <input
              type="number"
              defaultValue={each.cputime}
              onChange={(event) => handleChangeEditModal(
																	    event,
																	    each.count,
																	    'cputime',
              )}
              ref={cputimeEditRef}
            />
          ) : (
            <h4>
              {each.cputime ? `${each.cputime} %` : '0 %'}
            </h4>
          )}
        </div>

        <div className={classes.row}>
          <h2>Memory:</h2>
          {currentEdit == each.count && editStackModal ? (
            <input
              type="number"
              defaultValue={each.memory}
              onChange={(event) => handleChangeEditModal(
																	    event,
																	    each.count,
																	    'memory',
              )}
              ref={memoryEditRef}
            />
          ) : (
            <h4>
              {each.memory ? `${each.memory} %` : '0 %'}
            </h4>
          )}
        </div>

        <div className={classes.row}>
          <h2>status:</h2>
          {currentEdit == each.count && editStackModal ? (
            <input
              type="number"
              defaultValue={each.status}
              onChange={(event) => handleChangeEditModal(
																	    event,
																	    each.count,
																	    'status',
              )}
              ref={statusEditRef}
            />
          ) : (
            <h4>
              {each.status ? `${each.status} %` : '0 %'}
            </h4>
          )}
        </div>

        <div className={classes.row}>
          <h2>Total Points:</h2>
          {currentEdit == each.count && editStackModal ? (
            <input
              type="number"
              defaultValue={each.points}
              onChange={(event) => handleChangeEditModal(
																	    event,
																	    each.count,
																	    'points',
              )}
              min="0"
            />
          ) : (
            <h4>
              {each.points ? `${each.points} pts.` : '0 %'}
            </h4>
          )}
        </div>

        <div className={classes.row}>
          <h2>Rubrics Title: </h2>
          <h2>Rubrics Rating: </h2>
          {
																currentEdit == each.count && editStackModal ? (
  <>
    <button
      onClick={() => inputEditorAdd(index, 'rubrics')}
      className="d-block float-end m-2 btn btn-success rounded-pill border-1"
      type="button"
    >
      +Add
    </button>
    {each.rubrics.map((e, pos) => (
    // console.log(data)
      <div className="container d-flex justify-content-end align-items-center gap-4">
        <input
          name="rubricTitle"
          defaultValue={e.rubricRating}
          placeholder="rubricTitle"
          onChange={(e) => inputEditorChange(
																					    e,
																					    index,
																					    pos,
																					    'rubrics',
          )}
        />
        <input
          name="rubricRating"
          defaultValue={e.rubricTitle}
          placeholder="rubricRating"
          onChange={(e) => inputEditorChange(
																					    e,
																					    index,
																					    pos,
																					    'rubrics',
          )}
        />
        <button
          onClick={() => inputEditorDelete(
																					    index,
																					    pos,
																					    'rubrics',
          )}
          type="button"
          className="btn btn-danger border-1 border-black rounded-pill"
        >
          <AiFillDelete />
        </button>
      </div>
    ))}
  </>
																) : (
  <>
    {each.rubrics.map((e, pos) => (
    // console.log(data)
      <div className="container d-flex mx-4 justify-content-between align-items-center ">
        <div className=" row">
          <h4 className="d-inline-block text-truncate">{`${e.rubricTitle}`}</h4>
        </div>

        <div className=" row">
          <h4 className="d-inline-block text-truncate float-right">
            {e.rubricRating}
          </h4>
        </div>
      </div>
    ))}
  </>
																)
																// (<h4>{each.input}</h4>)
															}
        </div>
      </div>
    </div>
    <hr />
    <div className={classes.btnContainer}>
      <button
        type="button"
        className={classes.deleteBtn}
        onClick={() => deleteQuestionStack(each)}
      >
        <AiFillDelete />
      </button>
      <button
        type="button"
        className={classes.updateBtn}
        onClick={() => handleEditModal(each)}
      >
        <AiFillEdit />
      </button>
    </div>
    <dir className="row">
      <h3>Sample Code Metrics </h3>
      <div className="col">
        <h4>Language: </h4>
        <h5>{each.result.language}</h5>
      </div>
      <div className="col">
        <h4>Time: </h4>
        <h5>{`${each.result.time} sec`}</h5>
      </div>
      <div className="col">
        <h4>Status: </h4>
        <h5>{each.result.status}</h5>
      </div>
      <div className="col">
        <h4>Memory: </h4>
        <h5>{`${each.result.memory} kbs`}</h5>
      </div>
    </dir>
  </div>
									  ))
								  : 'No Question Stack added'}
              </div>
            </Modal>

            {/* MODAL end */}
          </div>
        ) : (
        // student view part
          <>
            <button
              type="button"
              className="btn btn-success  fs-5 rounded-pill border-3"
              onClick={() => openExam(task._id)}
            >
              <BiCuboid />
              Take Exam
            </button>

            <Modal
              isOpen={modalTakeExam}
              onRequestClose={closeExam}
              className={classes.modal}
              overlayClassName={classes.overlay}
              contentLabel="Take Exam"
              ariaHideApp={false}
            >
              <button
                onClick={closeExam}
                type="button"
                className="float-end btn p-4 fs-1 rounded-circle"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="close"
              >
                <AiOutlineCloseCircle />
              </button>
              <div className={classes.titleTask}>
                <h1 className={classes.titleQuestion}>
                  Total Items -
                  {' '}
                  {data.length}
                </h1>
              </div>
              <div className="container p-4">
                <p className="fs-4">
                  Welcome to the Hirati Online exam! Please read the following
                  instructions carefully to ensure a smooth and fair testing
                  experience. Make sure you have a stable internet connection
                  and a quiet environment to minimize distractions. Follow the
                  Input/Output specified for each section and submit your
                  answers within the given timeframe. Submit the final exam only
                  when you have completed all the questions. Double-check your
                  answers before submission. Good luck!
                </p>
              </div>

              {data.length !== 0 && userData.role === 'student'
							  ? data.map((question, index) => (
  <div className="container-fluid row gap-4 mx-auto justify-content-center my-2 mb-2">
    <div className={classes.titleTask}>
      <h1 className={classes.titleQuestion}>
        Question #
        {' '}
        {question.questionCount}
      </h1>
    </div>
    <div className="container my-0 mx-auto">
      <p className={classes.descriptionBox} style={{ whiteSpace: 'pre-wrap' }}>
        {question.description}
      </p>
    </div>
    <div className="card col-4 bg-transparent border-0">
      <div className="card-body">
        <h2 className=" fw-bolder">Language</h2>
        <div
          className="my-4 container w-75 p-4 border border-dark border-4"
          style={{
            backgroundColor: 'rgba(138, 138, 138, 0.404)',
            borderRadius: '20px',
          }}
        >
          <h3 className="text-center">
            {question.language ? question.language : ''}
          </h3>
        </div>
        <h2 className=" fw-bolder">Expected Case Result</h2>
        <div
          className="mb-4 container p-4 border border-dark border-4 fw-bolder"
          style={{
            backgroundColor: 'rgba(138, 138, 138, 0.404)',
            borderRadius: '20px',
          }}
        >
          <div className="d-block text-center">
            <div className="row">
              <h4 className="col fw-bolder">Input: </h4>
              <h4 className="col fw-bolder">Output: </h4>
            </div>
            {question.testcase.map((e, pos) => (
              <div className="row ">
                <h4 className="col fw-bolder">{` ${e.input}`}</h4>
                <h4 className="col fw-bolder">{` ${e.output}`}</h4>
              </div>
            ))}
          </div>
        </div>

        <h3 className=" fw-bolder">
          {' '}
          Metrics Automated Checking
          {' '}
        </h3>
        <div
          className="mb-4 container-fluid p-4 border border-dark border-4"
          style={{
            backgroundColor: 'rgba(138, 138, 138, 0.404)',
            borderRadius: '20px',
          }}
        >
          <div className="d-block text-center">
            <div className="row">
              <h4 className="col fw-bolder">{'CPU '}</h4>
              <h4 className="col fw-bolder">{'Memory '}</h4>
              <h4 className="col fw-bolder">{'Status '}</h4>
            </div>

            <div className="row ">
              <h4 className="col fw-bolder">{`${question.rubrics?.cputime}%`}</h4>
              <h4 className="col fw-bolder ">{`${question.rubrics?.memory}%`}</h4>
              <h4 className="col fw-bolder ">{`${question.rubrics?.status}%`}</h4>
            </div>
          </div>
        </div>

        <h2 className=" fw-bolder">Additional Rubrics </h2>
        <div
          className="mb-2 container-fluid p-4 border border-dark border-4"
          style={{ backgroundColor: 'rgba(138, 138, 138, 0.404)', borderRadius: '20px' }}
        >
          <div className="d-block text-center">
            <div className="row">
              <h4 className="col fw-bolder">
                {'Rubric Title: '}
              </h4>
              <h4 className="col fw-bolder">{'Rating: '}</h4>
            </div>

            {question.rubricAdditional.map((e, pos) => (
              <div className="row ">
                <h4 className="col fw-bolder">
                  {e.rubricTitle}
                </h4>
                <h4 className="col fw-bolder ">
                  {e.rubricRating}
                </h4>
              </div>
            ))}
          </div>
        </div>

        <div className="container text-center">
          <button
            type="button"
            className="btn btn-success p-4 rounded-pill fs-4 mx-auto my-4 "
            onClick={viewSampleCode}
            disabled={!question.permission}
          >
            {' '}
            View Sample Code
          </button>
          {/* Modal Student to view sample code */}
          <Modal
            isOpen={viewSample}
            onRequestClose={() => setViewSample(!viewSample)}
            className={classes.modalSampleCode}
            overlayClassName={classes.overlay}
            contentLabel="view sample code"
            ariaHideApp={false}
          >
            <div className="container-fluid p-4">
              <h1>Sample Code</h1>
              <h4 style={{ whiteSpace: 'pre-wrap' }}>
                {question.code}
              </h4>
            </div>
          </Modal>
        </div>
      </div>
    </div>

    <div className="card col-7 bg-transparent border-0">
      <div className="card-body ">
        <div className={classes.columnSampleCode}>
          <Editor handleEditorData={handleEditorData} answerFlag codeId={index} questionId={question._id} />
        </div>
      </div>
    </div>
    <hr />
    {/* on button to submit all answer */}
    {data.length - 1 === index ? (
      <AnswerButtonSubmit answerData={answerData} close={closeExam} />
    ) : (<br />)}
  </div>
                ))
							  : 'No Uploaded Question Yet!'}
            </Modal>
          </>
        )}
      </td>
    </tr>
  );
}

export default TaskItem;
