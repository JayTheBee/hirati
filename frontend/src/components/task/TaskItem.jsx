import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';

import {
  AiFillDelete, AiFillEdit, AiFillFileAdd, AiOutlineCloseCircle,
} from 'react-icons/ai';
import toast from 'react-hot-toast';
import question from '../../resource/question.png';
import LanguagesDropdown from '../editor/LanguagesDropdown';
import classes from './TaskItem.module.scss';
import Editor from '../editor/QuestionEditor';
import languageOptions from '../editor/languageOption';
// All data Stored for db submission
// let collateData = [];
// for Dev purpose only delete later
let collateData = [
  {
    language: 'C (Clang 9.2.0)',
    languageId: 50,
    description: '123123asdaweqwuoiqwrqw qwklrj qlwriqw qwkr jqwlruqwo irqwjrl qwjriqlwrqilwrjql wijrqwlrj qwlirjqwirluqwlriqjwrilqjwrl qijwrlq w',
    input: '213',
    output: '213',
    cputime: '25',
    memory: '25',
    status: '50',
    points: '213',
    result: {
      time: '0.161',
      language: 'JavaScript',
      id: 63,
      status: 'Accepted',
      memory: 6980,
    },
    count: 1,
    task_id: '63d8cc1c97db8f00a2debf15',
  },
];

// editor Data is given for now cuz its so damn slow fetching from judge0
let editorData = {
  time: '0.161',
  language: 'JavaScript (Node.js 12.14.0)',
  id: 63,
  status: 'Accepted',
  memory: 6980,
};

let additionalCase = [];
let additionalRubrics = [];
let languageName = {};

function TaskItem({
  task, deleteTask, updateButtonClick, count,
}) {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [viewStackmodal, setviewStackmodal] = React.useState(false);
  const [editStackModal, setEditStackModal] = React.useState(false);
  const [toggleCondition, setToggleCondition] = React.useState(true);
  const [addRubrics, setAddRubrics] = React.useState(false);
  const [counter, setCount] = React.useState(1);
  const [data, setData] = React.useState([]);

  function openModal() {
    setIsOpen(true);
  }

  function openviewStackmodal() {
    setviewStackmodal(true);
  }

  function truncate(str, n) {
    return (str.length > n) ? `${str.slice(0, n - 1)}...` : str;
  }

  function deleteQuestionStack(questionNumber) {
    // weird useState behavior due to asynchronous in nature
    // console.log(collateData);
    // collateData = data.filter((each) => each.count !== questionNumber);
    // console.log(collateData);

    setData(data.filter((each) => each.count !== questionNumber));
    // console.log(data);
    toast.success(`Question #${questionNumber} is deleted`);
  }

  useEffect(() => {
    setData(collateData);
    console.log('this run');
    // setData(collateData);
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
  const inputEditRef = useRef();
  const outputEditRef = useRef();
  const cputimeEditRef = useRef();
  const memoryEditRef = useRef();
  const statusEditRef = useRef();
  const pointsEditRef = useRef();
  const rubricTitleEditRef = useRef();
  const rubricRatingEditRef = useRef();
  const descriptionEditRef = useRef();
  const languageEditRef = useRef();

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

  const languageChange = (selectedLanguage) => {
    languageName = { name: selectedLanguage.name, id: selectedLanguage.id };
    console.log(languageName);
  };

  const openUpdateform = async () => {
    updateButtonClick(task);
  };

  // Uncomment this later
  const handleEditorData = async (data) => {
    // editorData = data;
    // console.log(editorData);

    console.log(editorData);
  };

  // clear all values
  const clearAllVal = () => {
    editorData = [];
    additionalCase = [];
    additionalRubrics = [];
    descriptionRef.current.value = '';
    inputRef.current.value = '';
    outputRef.current.value = '';
    clearRubrics();
    clearInput();
  };

  const handleEditModal = (count) => {
    setEditStackModal(!editStackModal);
    // const index = data.findIndex((each) => each.count == count);
    // console.log(data[index]);
    // console.log(descriptionRef.current.value != null);

    // editStackModal
    //   ? console.log(`yawa true ${index}`)
    //   : console.log(`yawa false ${index}`);
  };

  // holy moly Dynamic update SHEESH
  const handleChangeEditModal = (e, count, field) => {
    const index = data.findIndex((each) => each.count === count);
    // if (field === 'status' || 'cputime' || 'memory') {

    switch (field) {
      case 'status':
        if (parseInt(collateData[index].cputime) + parseInt(collateData[index].memory) + parseInt(e.target.value) !== 100) {
          e.target.style.textDecoration = 'underline';
          e.target.style.textDecorationColor = 'red';
          collateData[index][field] = e.target.value;
          return;
        }
        e.target.style.textDecoration = 'none';
        break;
      case 'cputime':
        if (parseInt(collateData[index].status) + parseInt(collateData[index].memory) + parseInt(e.target.value) !== 100) {
          e.target.style.textDecoration = 'underline';
          e.target.style.textDecorationColor = 'red';
          collateData[index][field] = e.target.value;
          return;
        }
        e.target.style.textDecoration = 'none';
        break;
      case 'memory':
        if (parseInt(collateData[index].cputime) + parseInt(collateData[index].status) + parseInt(e.target.value) !== 100) {
          e.target.style.textDecoration = 'underline';
          e.target.style.textDecorationColor = 'red';
          collateData[index][field] = e.target.value;
          return;
        }
        e.target.style.textDecoration = 'none';
        break;
      default:
        break;
    }
    collateData[index][field] = e.target.value;
    // data[index][field] = e.target.value;
    // setData(collateData);
    // dapat same sila dito ng res
    console.log(collateData);
    console.log(data);
  };

  const closeModal = () => {
    if (confirm('Exiting means resetting all the value in stack! Please submit all before proceeding')) {
      setCount(1);
      setAddRubrics(false);
      setToggleCondition(true);
      collateData = [];
      setData([]);
      clearAllVal();
      setIsOpen(false);
    }
  };

  const closeViewAllModal = () => {
    setviewStackmodal(false);
  };

  // One instance for now -->> On going with other scenario, impelements Create when all fields are given
  const handleSubmit = () => {
    try {
      if (data.length > 0) {
        collateData.map(async (each) => {
          await axios.post('/api/question/', each);
        });
        clearAllVal();
        toast.success('All questions in the stack are uploaded!');
      }
      toast.error('Cannot Upload due to empty stack');
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
    if (languageName.name === undefined || languageName.id === undefined || descriptionRef.current.value === '') {
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
        languageId: languageName.id,
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
      });
      console.log('scene1');
      // Scenario 2: disabled default rubric scenario and without additional set Criteria/TestCase
    } else if (additionalRubrics.length === 0 && additionalCase.length === 0 && !toggleCondition) {
      collateData.push({
        language: languageName.name,
        languageId: languageName.id,
        description: descriptionRef.current.value,
        input: inputRef.current.value,
        output: outputRef.current.value,
        result: editorData,
        task_id: task._id,
      });
      console.log('scene2');
    } else {
      collateData.push({
        rubrics: additionalRubrics,
        ...additionalCase,
        result: editorData,
        description: descriptionRef.current.value,
        language: languageName.name,
        languageId: languageName.id,
        task_id: task._id,
      });
      console.log('scene3');
    }

    clearAllVal();
    toast.success(`Question #${counter} added to the stack!`);
    setCount(counter + 1);
    console.log(collateData);
    setData(collateData);
  };

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

      <td>
        <p className={moment().isBefore(task.dateExp) ? classes.active : classes.completed}>
          {moment().isBefore(task.dateExp) ? 'Active' : 'Completed'}
        </p>
      </td>

      <td>
        <div className={classes.action}>
          <button onClick={openModal} type="button" className={classes.assignBtn}>
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
              <AiOutlineCloseCircle />
            </button>
            <div className={classes.titleTask}>
              <h5>

                Task Name
              </h5>

              <h1 className={classes.titleQuestion}>
                {` ${task.title} `}
              </h1>
            </div>
            <h2 className={classes.center}>
              Question #
              {`${counter}`}
            </h2>
            <br />
            <h3>Please fill necessary details such as Language, Description and Sample Code. While Test Cases and Rubrics are'nt necessary, these are important for Automated Grading. Rubrics(Memory, Cputime and Status) requires to equate to a total of 100 but can be disabled in the event that the professor wants to manually check.  </h3>

            <form className={classes.addNewForm} onSubmit="">
              <div className={classes.row}>
                <div className={classes.columnInput}>
                  <label>
                    Language:
                    <LanguagesDropdown className={classes.language} onSelectChange={languageChange} />
                    <br />
                  </label>
                  <label htmlFor="description">
                    Description:
                    <textarea name="description" type="areatext" placeholder="Enter Description . . ." id="description" ref={descriptionRef} required />

                  </label>

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

                        <input name="cputime" type="number" placeholder="Cputime Percentage" id="y" ref={cputimeRef} defaultValue="" disabled={!toggleCondition} required />
                        <input name="memory" type="number" placeholder="Memory Percentage" id="memory" ref={memoryRef} defaultValue="" disabled={!toggleCondition} required />
                      </div>
                      <div className={classes.row}>
                        <input name="status" type="number" placeholder="Status Percentage" id="status" ref={statusRef} defaultValue="" disabled={!toggleCondition} required />
                        <input name="points" type="number" placeholder="Total Points" id="score" ref={pointsRef} defaultValue="" disabled={!toggleCondition} required />
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
                  <button type="button" onClick={openviewStackmodal}>
                    View All Question in stack
                  </button>

                  {/* to do Submit all data to mongodb */}
                  <button type="button" onClick={handleSubmit}>Submit All</button>

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
            contentLabel="Assign Task"
            ariaHideApp={false}
          >
            {/* modal render view all stack question */}
            <button onClick={closeViewAllModal} type="button" className={classes.modalClose}>
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
            <div className={classes.containerFlex}>

              {data.length > 0 ? (
                data.map((each) => (
                  <div className={classes.card}>
                    <div className={classes.content}>
                      <img src={question} alt="Question Logo" />
                      <div className={classes.column}>
                        <div className={classes.row}>
                          <h2>{`Question ${each.count}`}</h2>
                        </div>
                        <div className={classes.row}>
                          <h2>Language: </h2>
                          {editStackModal ? (
                            <select name="language" id="language" defaultValue={each.language}>
                              <option value="JavaScript">JavaScript</option>
                              <option value="C">C</option>
                              <option value="C++">C++</option>
                              <option value="C#">C#</option>
                              <option value="Java">Java</option>
                              <option value="Python">Python</option>
                            </select>
                          ) : (<h4>{each.language}</h4>)}
                        </div>

                        <div className={classes.row}>
                          <h2>Description: </h2>
                          {!editStackModal ? (
                            <input
                              type="text"
                              onChange={(event) => handleChangeEditModal(event, each.count, 'description')}
                              defaultValue={each.description}
                            />

                          ) : (<h4>{truncate(each.description, 15)}</h4>)}
                        </div>

                        <div className={classes.row}>
                          <h2>Input: </h2>
                          {!editStackModal ? (
                            <input
                              type="text"
                              defaultValue={each.input}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'input')}
                            />
                          ) : (<h4>{each.input}</h4>)}
                        </div>

                        <div className={classes.row}>
                          <h2>Output:</h2>
                          {!editStackModal ? (
                            <input
                              type="text"
                              defaultValue={each.output}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'output')}
                            />
                          ) : (<h4>{each.output}</h4>)}
                        </div>

                        <div className={classes.row}>
                          <h2>Cpu time:</h2>
                          {!editStackModal ? (
                            <input
                              type="number"
                              defaultValue={each.cputime}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'cputime')}
                            />
                          ) : (<h4>{each.cputime}</h4>)}
                        </div>

                        <div className={classes.row}>
                          <h2>Memory:</h2>
                          {!editStackModal ? (
                            <input
                              type="number"
                              defaultValue={each.memory}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'memory')}
                            />
                          ) : (<h4>{each.memory}</h4>)}
                        </div>

                        <div className={classes.row}>
                          <h2>status:</h2>
                          {!editStackModal ? (
                            <input
                              type="number"
                              defaultValue={each.status}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'status')}
                            />
                          ) : (<h4>{each.status}</h4>)}
                        </div>

                        <div className={classes.row}>
                          <h2>Total Points:</h2>
                          {!editStackModal ? (
                            <input
                              type="number"
                              defaultValue={each.points}
                              onChange={(event) => handleChangeEditModal(event, each.count, 'points')}
                            />
                          ) : (<h4>{each.points}</h4>)}
                        </div>

                      </div>

                    </div>
                    <hr />
                    <div className={classes.btnContainer}>
                      <h2>Sample Code Metrics </h2>
                      <button type="button" className={classes.deleteBtn} onClick={() => deleteQuestionStack(each.count)}>
                        <AiFillDelete />
                      </button>
                      <button type="button" className={classes.updateBtn} onClick={() => handleEditModal(each.count)}>
                        <AiFillEdit />
                      </button>
                    </div>
                    <dir className={classes.containerFlex}>

                      <div className={classes.row}>
                        <h2>Language: </h2>
                        <h4>{each.result.language}</h4>
                      </div>
                      <div className={classes.row}>
                        <h2>Result Time: </h2>
                        <h4>{each.result.time}</h4>
                      </div>
                      <div className={classes.row}>
                        <h2>Result Status: </h2>
                        <h4>{each.result.status}</h4>
                      </div>
                      <div className={classes.row}>
                        <h2>Result Memory: </h2>
                        <h4>{each.result.memory}</h4>
                      </div>
                    </dir>

                  </div>
                ))

              ) : ('No Question Stack added')}
            </div>
          </Modal>

          {/* MODAL end */}

        </div>

      </td>

    </tr>
  );
}

export default TaskItem;
