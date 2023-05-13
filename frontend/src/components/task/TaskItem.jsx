import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';

import {
  AiFillDelete, AiFillEdit, AiFillFileAdd, AiOutlineCloseCircle,
} from 'react-icons/ai';
import toast from 'react-hot-toast';
import { BiCuboid } from 'react-icons/bi';
import question from '../../resource/question.png';
import KeywordsDropdown from './keywordsDropdown';
import classes from './TaskItem.module.scss';
import Editor from '../editor/QuestionEditor';

// All data Stored for db submission
let collateData = [];
let keywordData = [];
let editorData = {};

let additionalCase = [];
let additionalRubrics = [];
let languageName = {};
let currentEdit = 0;

function TaskItem({
  task, deleteTask, updateButtonClick, count,
}) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [viewStackmodal, setviewStackmodal] = React.useState(false);
  const [editStackModal, setEditStackModal] = React.useState(false);
  const [modalTakeExam, setTakeExam] = React.useState(false);
  const [toggleCondition, setToggleCondition] = React.useState(true);
  const [addRubrics, setAddRubrics] = React.useState(false);
  const [counter, setCount] = React.useState(1);
  const [data, setData] = React.useState([]);

  const userData = JSON.parse(localStorage.getItem('user'));

  // View all in stack modal fetch existing question from db if meron

  function truncate(str, n) {
    return (str.length > n) ? `${str.slice(0, n - 1)}...` : str;
  }

  async function deleteQuestionStack(eachData) {
    // weird useState behavior due to asynchronous in nature
    // console.log(collateData);
    // collateData = data.filter((each) => each.count !== questionNumber);
    // console.log(collateData);

    // setData(data.filter((each) => each.count !== questionNumber));
    console.log(eachData);
    if (Object.prototype.hasOwnProperty.call(eachData, 'questionId')) { await axios.delete(`/api/question/${eachData.questionId}`); }
    setData(data.filter((each) => each.count !== eachData.count));
    setCount(counter - 1);
    toast.success(`Question #${eachData.count} is deleted`);
  }

  function handleKeywords(e) {
    keywordData = (Array.isArray(e) ? e.map((x) => x.value) : []);
    if (keywordData.length > 0) {
      // handleChangeEditModal(keywordData,'keywords', )
      console.log(keywordData);
    }
  }

  useEffect(() => {
    setData(collateData);
  }, []);

  const inputRef = useRef();
  const outputRef = useRef();
  const cputimeRef = useRef();
  const memoryRef = useRef();
  const statusRef = useRef();
  const pointsRef = useRef();
  const rubricTitleRef = useRef();
  const rubricRatingRef = useRef();
  const descriptionRef = useRef();

  // modal edit ref
  const cputimeEditRef = useRef();
  const memoryEditRef = useRef();
  const statusEditRef = useRef();

  const clearRubrics = () => {
    if (toggleCondition && addRubrics) {
      statusRef.current.value = '';
      memoryRef.current.value = '';
      cputimeRef.current.value = '';
      pointsRef.current.value = '';
      rubricRatingRef.current.value = '';
      rubricTitleRef.current.value = '';
    }
    if (toggleCondition) {
      statusRef.current.value = '';
      memoryRef.current.value = '';
      cputimeRef.current.value = '';
      pointsRef.current.value = '';
    }
  };

  const clearInput = () => {
    descriptionRef.current.value = '';
    inputRef.current.value = '';
    outputRef.current.value = '';
  };

  const handleChange = (e) => {
    const res = e.currentTarget.value === 'true';
    console.log(res);
    setToggleCondition(res);
    res ? statusRef.current.style.backgroundColor = 'white' : statusRef.current.style.backgroundColor = 'gray';
    res ? memoryRef.current.style.backgroundColor = 'white' : memoryRef.current.style.backgroundColor = 'gray';
    res ? cputimeRef.current.style.backgroundColor = 'white' : cputimeRef.current.style.backgroundColor = 'gray';
    res ? pointsRef.current.style.backgroundColor = 'white' : pointsRef.current.style.backgroundColor = 'gray';

    clearRubrics();
  };

  const openUpdateform = async () => {
    updateButtonClick(task);
  };

  // Uncomment this later
  const handleEditorData = async (data) => {
    editorData = data;
    // console.log(data);
    languageName = { name: editorData.language };
    console.log(editorData);
  };

  // clear all values
  const clearAllVal = () => {
    // editorData = [...{}, { language: editorData.language }];
    ({ language: editorData.language });
    additionalCase = [];
    additionalRubrics = [];
    descriptionRef.current.value = '';
    inputRef.current.value = '';
    outputRef.current.value = '';
    clearRubrics();
    clearInput();
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

    // if (parseInt(data.status) === 0
    // && parseInt(data.cputime) === 0
    // && parseInt(data.memory) === 0) { setEditStackModal(!editStackModal); return; }
    if ((parseInt(data.status)
      + parseInt(data.cputime)
      + parseInt(data.memory) !== 100)) {
      toast.error('Please enter valid percentage for cpu,memory and status that equates to 100%');
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
    // if (confirm('Exiting means resetting all the value in stack! Please submit all before proceeding')) {
    setCount(1);
    setAddRubrics(false);
    setToggleCondition(true);
    collateData = [];
    setData([]);
    clearAllVal();
    setIsOpen(false);
    // }
  };

  const closeViewAllModal = () => {
    // logic for preventing user from closing modal while edit mode is true
    if (editStackModal == true) { setviewStackmodal(true); toast.error('Please finish Editing before closing! '); } else { setviewStackmodal(false); }
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
          (Object.prototype.hasOwnProperty.call(data, 'questionId'))
            ? await axios.put('/api/question/', each)
            : await axios.post('/api/question/', each);
        });
        clearAllVal();
        toast.success('All questions in the stack are uploaded!');
        closeModal();
      } else { toast.error('Cannot Upload due to empty stack'); }
    } catch (err) {
      console.log(err);
      toast.error('Something Went wrong! ');
    }
  };

  const handleAdditionalCase = () => {
    if (inputRef.current.value && outputRef.current.value) {
      if (confirm('Add additional case for this question?')) {
        additionalCase.push({ testcase: { input: inputRef.current.value, output: outputRef.current.value } });
        toast.success('Additional Case Added');
      }
    } else if (confirm('Push to stack with missing data in input/output ?')) {
      additionalCase.push({ testcase: { input: inputRef.current.value, output: outputRef.current.value } });
      toast.success('Additional Case Added');
    }
    inputRef.current.value = '';
    outputRef.current.value = '';
  };

  const toggleAdditionalRubrics = () => {
    setAddRubrics(!addRubrics);
  };

  const checkRubricsPercentage = () => {
    if (toggleCondition && (parseInt(statusRef.current.value)
    + parseInt(cputimeRef.current.value)
    + parseInt(memoryRef.current.value) !== 100)) {
      return false;
    }
    return true;
  };

  const checkRequiredIfEmpty = () => {
    if (editorData.language === undefined || descriptionRef.current.value === '') {
      toast.error('Language and Description cannot be empty');
      return true;
    }
    return false;
  };

  const checkRubricsIfEmpty = () => {
    if (statusRef.current.value === '' || memoryRef.current.value === '' || cputimeRef.current.value === '' || pointsRef.current.value === '') {
      // toast.error('Memory, Points, Status and CPU time cannot be empty');
      return true;
    }
    return false;
  };

  const handleAdditionalRubrics = () => {
    // Logic for Data assigning
    // if enabled
    if (toggleCondition && checkRubricsPercentage()) {
      // confirm
      if (confirm('Perform add Custom Rubrics with default Rubrics?')) {
        // check meron lahat
        if (rubricTitleRef.current.value
          && rubricRatingRef.current.value
          && cputimeRef.current.value
          && memoryRef.current.value
          && statusRef.current.value
          && pointsRef.current.value
        ) {
          const data = {
            cputime: cputimeRef.current.value,
            memory: memoryRef.current.value,
            status: statusRef.current.value,
            points: pointsRef.current.value,
            rubricTitle: rubricTitleRef.current.value,
            rubricRating: rubricRatingRef.current.value,
          };
          additionalRubrics.push(data);
          console.log(additionalRubrics);

          toast.success('Additional Case Added with default Rubrics');
          // clearRubrics();
        } else {
          toast.error('Please Complete all Data!');
        }
      }
    }
    // disabled part scenario
    else if (!toggleCondition && rubricTitleRef.current.value && rubricRatingRef.current.value) {
      const data = {
        rubricTitle: rubricTitleRef.current.value,
        rubricRating: rubricRatingRef.current.value,
      };
      if (confirm(`Adding ${data.rubricTitle} as a Criteria with ${data.rubricRating}% points`)) {
        additionalRubrics.push((data));
        console.log(additionalRubrics);
        toast.success('Additional Case Added');
        clearRubrics();
      } else {
        toast.error('Please Complete all Data!');
      }
    } else {
      toast.error('Please Complete all Data!');
    }
    toggleAdditionalRubrics();
  };

  const handleAnotherQuestion = () => {
    if (checkRequiredIfEmpty()) { return; }
    if (checkRubricsIfEmpty() && toggleCondition) {
      toast.error('Default Rubrics for automated Testing is enabled. Please fill all fields or disable it. ');
      return;
    }
    if (!checkRubricsPercentage() && toggleCondition) {
      toast.error('Please fill Rubrics Cputime, Memory and Status with whole number that equates to 100%');
      return;
    }

    // Scenario 1: All rubrics are required (Enabled)
    if (additionalRubrics.length === 0
      && additionalCase.length === 0
      && toggleCondition
    ) {
      collateData.push({
        language: languageName.name,
        // languageId: languageName.id,
        description: descriptionRef.current.value,
        input: inputRef.current.value,
        output: outputRef.current.value,
        cputime: cputimeRef.current.value,
        memory: memoryRef.current.value,
        status: statusRef.current.value,
        points: pointsRef.current.value,
        result: editorData,
        count: counter,
        task_id: task._id,
        keywords: keywordData,
      });
      console.log('scene1');
      // Scenario 2: disabled default rubric scenario and without additional set Criteria/TestCase
    } else if (additionalRubrics.length === 0 && additionalCase.length === 0 && !toggleCondition) {
      collateData.push({
        language: languageName.name,
        // languageId: languageName.id,
        description: descriptionRef.current.value,
        input: inputRef.current.value,
        output: outputRef.current.value,
        result: editorData,
        task_id: task._id,
        count: counter,
        keywords: keywordData,
      });
      console.log('scene2');
    } else {
      collateData.push({
        rubrics: additionalRubrics,
        ...additionalCase,
        result: editorData,
        description: descriptionRef.current.value,
        language: languageName.name,
        // languageId: languageName.id,
        task_id: task._id,
        count: counter,
        keywords: keywordData,
      });
      console.log('scene3');
    }

    clearAllVal();
    toast.success(`Question #${counter} added to the stack!`);
    setCount(counter + 1);
    setData(collateData);
    console.log(data);
  };

  // Student Access to task
  const getQuestion = async (taskId) => {
    try {
      const { data } = await axios.get(`/api/question/${taskId}`);
      if (userData.role === 'student' && data.length > 0) {
        data.forEach((each) => {
          console.log(each.rubrics?.cputime ?? 0);
          collateData.push({
            count: each.questionCount,
            language: each.resultSample.language,
            cputime: (each.rubrics?.cputime ?? 0),
            memory: (each.rubrics?.memory ?? 0),
            status: (each.rubrics?.status ?? 0),
            description: each.description,
            input: each.testcase.input,
            output: each.testcase.output,
            keywords: [...each.keywords],
            result: {
              language: each.resultSample.language,
              time: parseFloat(each.resultSample.time?.$numberDecimal ?? 0),
              // time: each.resultSample.time,
              status: (each.resultSample?.status ?? 'not specified'),
              // id: each.resultSample.time.$numberDecimal,
              memory: each.resultSample.memory,
            },
            task_id: each.taskId,
            points: each.points,
            questionId: each._id,
          });
        });
        // console.log();
        console.log('collated is ', collateData);
        setCount(data.length + 1);
        setData(collateData);
        return;
      }
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

  return (
    <tr className={classes.task_item}>
      <td>
        {count}
      </td>
      <td>
        {/* <Link to="task" state={{ classId: params.id, taskId: task._id, taskName: task.title }}> */}
        {' '}
        { task.title}
        {/* </Link> */}
      </td>
      <td>{moment(task.createdAt).calendar()}</td>
      <td>{moment(task.dateExp).format('MMMM Do YYYY, h:mm a')}</td>
      <td>{task.category}</td>

      <td className={moment().isBefore(task.dateExp) ? classes.active : classes.completed}>
        <p>
          {moment().isBefore(task.dateExp) ? 'Active' : 'Completed'}
        </p>
      </td>

      <td>
        {
        userData.role === 'teacher'
          ? (
            <div className={classes.action}>
              <button onClick={() => openModal(task._id)} type="button" className={classes.assignBtn}>
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
                <button onClick={closeModal} type="button" className={classes.modalClose}>
                  X
                </button>
                <div className={classes.titleTask}>
                  <h5 className="fw-bolder">
                    Task Name
                  </h5>

                  <h1 className={classes.titleQuestion}>
                    {` ${task.title} `}
                  </h1>
                </div>
                <h2 className="text-center fw-bold">
                  Question #
                  {`${counter}`}
                </h2>
                <br />
                <h4>Please fill necessary details such as Language, Description and Sample Code. While Test Cases and Rubrics are'nt necessary, these are important for Automated Grading. Rubrics(Memory, Cputime and Status) requires to equate to a total of 100% but can be disabled in the event that the professor wants to manually check.  </h4>

                <form className={classes.addNewForm} onSubmit="">
                  <div className={classes.row}>
                    <div className={classes.columnInput}>

                      <div className=" w-100">
                        <label>
                          Set Keywords:
                        </label>
                        <KeywordsDropdown onSelectChange={handleKeywords} />
                      </div>
                      <br />
                      <div className="w-100 ">
                        <label htmlFor="description">
                          Description:
                        </label>
                        <textarea name="description" type="areatext" placeholder="Enter Description . . ." id="description" ref={descriptionRef} required />
                      </div>

                      <label htmlFor="testcase">
                        <br />
                        Test Case:
                        <div className={classes.row}>
                          <input name="input" type="text" id="input" placeholder="Input" defaultValue="" ref={inputRef} />
                          <input name="output" type="text" id="output" placeholder="Output" defaultValue="" ref={outputRef} />
                          <button onClick={handleAdditionalCase} type="button">
                            Set Additional
                          </button>
                        </div>
                      </label>

                      <label htmlFor="performance">
                        <br />
                        Rubrics for Automated Scoring:
                        <div>
                          <div className={classes.row}>
                            <input name="cputime" type="number" placeholder="Cputime %" id="y" ref={cputimeRef} defaultValue="" disabled={!toggleCondition} required />
                            <input name="memory" type="number" placeholder="Memory %" id="memory" ref={memoryRef} defaultValue="" disabled={!toggleCondition} required />

                          </div>
                          <div className={classes.row}>
                            <input name="status" type="number" placeholder="Status %" id="status" ref={statusRef} defaultValue="" disabled={!toggleCondition} required />
                            <input name="points" type="number" min="0" placeholder="Total Points" id="score" ref={pointsRef} defaultValue="" disabled={!toggleCondition} required />
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

                            <button onClick={toggleAdditionalRubrics} type="button">
                              {/* <button onClick={handleAdditionalRubrics} type="button" disabled={!toggleCondition || addRubrics}> */}
                              {!addRubrics ? 'Set Criteria' : 'Toggle Close'}
                            </button>
                          </div>

                          {addRubrics && (
                          <div className={classes.row}>
                            <input name="rubricTitle" type="string" placeholder="Criteria Title" id="rubricTitle" ref={rubricTitleRef} />
                            <input name="rubricRating" type="number" placeholder="Total Points" id="rubricRating" ref={rubricRatingRef} />
                            <button type="button" onClick={handleAdditionalRubrics}>
                              Add
                            </button>
                          </div>
                          ) }

                        </div>

                      </label>

                      <button type="button" onClick={handleAnotherQuestion}>
                        Add Question to stack
                      </button>

                      {/*  To do view all in stack */}
                      <button type="button" onClick={() => openviewStackmodal(task._id)}>
                        View All Question in stack
                      </button>

                      {/* to do Submit all data to mongodb */}
                      <button type="button" onClick={handleSubmit}>Submit All from Stack</button>

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
                // shouldCloseOnOverlayClick={false}
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
                <h3>
                  All Questions pushed into the stack:
                  {' '}
                </h3>
                <div className={classes.containerAllQuestion}>

                  {data.length > 0 ? (
                    data.map((each) => (
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
                              {/* {
                          currentEdit == each.count
                          && editStackModal ? (
                            <select name="language" id="language" defaultValue={each.language}>
                              <option value="JavaScript">JavaScript</option>
                              <option value="C">C</option>
                              <option value="C++">C++</option>
                              <option value="C#">C#</option>
                              <option value="Java">Java</option>
                              <option value="Python">Python</option>
                            </select>
                            ) : ( */}
                              <h4>{each.language}</h4>
                              {/* // )
                            // } */}
                            </div>

                            <div className={classes.row}>
                              <h2>Description: </h2>
                              { currentEdit == each.count
                          && editStackModal ? (
                            <input
                              type="text"
                              onChange={(event) => handleChangeEditModal(event, each.count, 'description')}
                              defaultValue={each.description}
                            />

                                ) : (<h4>{truncate(each.description, 15)}</h4>)}
                            </div>

                            <div className={classes.row}>
                              <h2>Input: </h2>
                              {currentEdit == each.count
                          && editStackModal ? (
                            <input
                              type="text"
                              defaultValue={each.input}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'input')}
                            />
                                ) : (<h4>{each.input}</h4>)}
                            </div>

                            <div className={classes.row}>
                              <h2>Output:</h2>
                              {currentEdit == each.count
                          && editStackModal ? (
                            <input
                              type="text"
                              defaultValue={each.output}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'output')}
                            />
                                ) : (<h4>{each.output}</h4>)}
                            </div>

                            <div className={classes.row}>
                              <h2>Keywords: </h2>
                              {currentEdit == each.count
                          && editStackModal ? (
                            <div className="container w-100">
                              <KeywordsDropdown
                                passValue={each.keywords}
                                onSelectChange={(event) => handleChangeEditModal(event, each.count, 'keywords')}
                              />
                            </div>
                                ) : (
                                  <h4>
                                    {(each.keywords).map((key, i) => (each.keywords.length - 1 === i ? `${key}` : `${key}, `))}
                                  </h4>
                                )}
                            </div>

                            <div className={classes.row}>
                              <h2>Cpu time:</h2>
                              {currentEdit == each.count
                          && editStackModal ? (
                            <input
                              type="number"
                              defaultValue={each.cputime}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'cputime')}
                              ref={cputimeEditRef}
                            />
                                ) : (<h4>{ each.points ? `${each.cputime} %` : '0 %'}</h4>)}
                            </div>

                            <div className={classes.row}>
                              <h2>Memory:</h2>
                              {currentEdit == each.count
                          && editStackModal ? (
                            <input
                              type="number"
                              defaultValue={each.memory}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'memory')}
                              ref={memoryEditRef}
                            />
                                ) : (<h4>{each.points ? `${each.memory} %` : '0 %'}</h4>)}
                            </div>

                            <div className={classes.row}>
                              <h2>status:</h2>
                              {currentEdit == each.count
                          && editStackModal ? (
                            <input
                              type="number"
                              defaultValue={each.status}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'status')}
                              ref={statusEditRef}
                            />
                                ) : (<h4>{each.status ? `${each.status} %` : '0 %'}</h4>)}
                            </div>

                            <div className={classes.row}>
                              <h2>Total Points:</h2>
                              {currentEdit == each.count
                          && editStackModal ? (
                            <input
                              type="number"
                              defaultValue={each.points}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'points')}
                              min="0"
                            />
                                ) : (<h4>{ each.points ? `${each.points} pts.` : '0 %'}</h4>)}
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
                          <button type="button" className={classes.updateBtn} onClick={() => handleEditModal(each)}>
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

                  ) : ('No Question Stack added')}
                </div>
              </Modal>

              {/* MODAL end */}

            </div>
          ) : (
            // student view part
            < >

              <button type="button" className="btn btn-success  fs-5 rounded-pill border-3" onClick={() => openExam(task._id)}>
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
                    Welcome to the Hirati Online exam! Please read the following instructions carefully to ensure a smooth and
                    fair testing experience. Make sure you have a stable internet connection
                    and a quiet environment to minimize distractions. Follow the Input/Output specified for each section and submit
                    your answers within the given timeframe. Submit the final exam only when you have completed all the questions.
                    Double-check your answers before submission. Good luck!
                  </p>
                </div>

                {data.length !== 0 && userData.role === 'student' ? data.map((question) => (
                  <div key={question.questionId} className="container-fluid row gap-4 mx-auto justify-content-center my-2 mb-2">
                    <div className={classes.titleTask}>
                      <h1 className={classes.titleQuestion}>
                        Question #
                        {' '}
                        {question.questionCount}
                      </h1>
                    </div>
                    <div className="container text-center my-0 mx-4">
                      <p className={classes.descriptionBox}>
                        {question.description}
                      </p>
                    </div>
                    <div className="card col-4 bg-transparent border-0">
                      <div className="card-body">
                        <h2 className="text-center">Language</h2>
                        <div className="my-4 container w-75 p-4 border border-dark border-4" style={{ backgroundColor: 'rgba(138, 138, 138, 0.404)', borderRadius: '20px' }}>
                          <h3 className="text-center">
                            {question.language ? question.language : ''}
                          </h3>

                        </div>
                        {/* sample code for conditional rendering of input/output */}
                        {/* {question.flag && } */}
                        <div>
                          <h2 className="text-center">Expected Case Result</h2>
                          <h3 className="mb-2 container p-4 border border-dark border-4" style={{ backgroundColor: 'rgba(138, 138, 138, 0.404)', borderRadius: '20px' }}>
                            Input:
                            {' '}
                            {question.input}
                          </h3>
                          <h3 className="mb-2 container p-4 border border-dark border-4" style={{ backgroundColor: 'rgba(138, 138, 138, 0.404)', borderRadius: '20px' }}>
                            Output:
                            {' '}
                            {question.output}
                          </h3>
                        </div>

                        <div className="container text-center">

                          <button type="button" className="btn btn-success p-4 rounded-pill fs-4 mx-auto my-4 "> View Sample Code</button>
                        </div>

                      </div>
                    </div>

                    <div className="card col-7 bg-transparent border-0">
                      <div className="card-body ">
                        <div className={classes.columnSampleCode}>
                          <Editor handleEditorData={handleEditorData} style />
                        </div>
                      </div>
                    </div>

                    <hr />
                  </div>

                )) : (
                  'No Uploaded Question Yet!'
                )}

              </Modal>
            </>
          )
}
      </td>

    </tr>
  );
}

export default TaskItem;
