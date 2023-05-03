import React, { useState, useRef } from 'react';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';

import {
  AiFillDelete, AiFillEdit, AiFillFileAdd, AiOutlineCloseCircle,
} from 'react-icons/ai';
import toast from 'react-hot-toast';
import LanguagesDropdown from '../editor/LanguagesDropdown';
import classes from './TaskItem.module.scss';
import Editor from '../editor/QuestionEditor';
import languageOptions from '../editor/languageOption';
// All data Stored for db submission
let collateData = [];

// editor Data is given for now cuz its so damn slow fetching from judge0
let editorData;
editorData = {
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
  const [toggleCondition, setToggleCondition] = React.useState(true);
  const [addRubrics, setAddRubrics] = React.useState(false);
  const [counter, setCount] = React.useState(1);
  function openModal() {
    setIsOpen(true);
  }

  const inputRef = useRef();
  const outputRef = useRef();
  const cputimeRef = useRef();
  const memoryRef = useRef();
  const statusRef = useRef();
  const pointsRef = useRef();
  const rubricTitleRef = useRef();
  const rubricRatingRef = useRef();
  const descriptionRef = useRef();

  // HANDLE THE ONCHANGE HERE
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

  // Uncomment this to get editorData when compiled
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
  const closeModal = () => {
    setCount(1);
    setAddRubrics(false);
    setToggleCondition(true);
    collateData = [];
    clearAllVal();
    setIsOpen(false);
  };

  // One instance for now -->> On going with other scenario, impelements Create when all fields are given
  const handleSubmit = () => {
    // collateData = { ...collateData };
    try {
      if (collateData.length > 0) {
        collateData.map(async (each) => {
          await axios.post('/api/question/', each);
        });
      }
      clearAllVal();
      toast.success('All questions in the stack are uploaded!');
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdditionalCase = () => {
    if (inputRef.current.value && outputRef.current.value) {
      if (confirm('Push to stack additional case for this question?')) {
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
      toast.error('Some Fields are empty in the rubrics! Make sure to fill it up or disable it. ');
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
      // enabled but some rubrics input are empty
    } else if (toggleCondition && checkRubricsIfEmpty() === true) {
      toast.error('Default Rubrics for automated Testing is enabled. Please fill all fields or disable it');
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

    // clearAllVal();
    toast.success('Question pushed all to stack!');
    setCount(counter + 1);
    console.log(collateData);
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
            <h2 className={classes.titleTask}>
              Task Title:
              <h1 className={classes.titleQuestion}>
                {` ${task.title} `}
              </h1>
            </h2>
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
                  <button type="button">
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
        </div>

      </td>

    </tr>
  );
}

export default TaskItem;
