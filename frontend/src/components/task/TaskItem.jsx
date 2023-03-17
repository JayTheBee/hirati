import React, { useState } from 'react';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { AiFillDelete, AiFillEdit, AiFillFileAdd } from 'react-icons/ai';
import classes from './TaskItem.module.scss';

function TaskItem({
  task, deleteTask, updateButtonClick, count,
}) {
  let subtitle;

  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const params = useParams();
  const openUpdateform = async () => {
    updateButtonClick(task);
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
      {/* update later for db update logic */}
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

          {/* MODAL */}
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            className={classes.modal}
            overlayClassName={classes.overlay}
            contentLabel="Assign Task"
          >
            {/* modal render */}
            <button onClick={closeModal} type="button" className={classes.modalClose}> X </button>
            <h1 className={classes.titleTask}>
              Assigning to
              {` ${task.title}`}
            </h1>
            <br />
            <p>Please Add your Question</p>
            <form className={classes.addNewForm} onSubmit="">
              <h1>
                Question: #
              </h1>
              <div className={classes.flex}>
                <label htmlFor="description">
                  Description:
                  <textarea name="description" type="areatext" placeholder="Enter Description . ." id="description" />

                </label>

                <label htmlFor="performance">
                  Performance:
                  <input name="cputime" type="number" placeholder="cputime" id="performance" />
                  <input name="memory" type="number" placeholder="memory" id="memory" />
                  <input name="score" type="number" placeholder="score" id="score" />
                </label>

                <label htmlFor="testcase">
                  Test Case

                  <input name="input" type="text" id="input" placeholder="input" />
                  <input name="output" type="text" id="output" placeholder="output" />
                  <button type="button">
                    Set Additional
                  </button>

                </label>

                <label htmlFor="constraints">
                  Constraint
                  <input name="example" type="text" id="example" placeholder="Input example" />
                  {/* <button type='button' onClick={() => dispatch({ type: 'exampleCount' })}> */}
                  <button type="button">
                    Set Additional
                  </button>

                  <input name="constraints" type="text" placeholder="Input constraints" id="constraints" />
                  <button type="button">
                    Set Additional
                  </button>
                </label>

              </div>

              <button type="submit">
                Add another Question
              </button>
              <button type="submit">Submit</button>
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
