import React, { useState } from 'react';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import classes from './TaskItem.module.scss';

function TaskItem({ task, deleteTask, updateButtonClick }) {
  const params = useParams();
  const openUpdateform = async () => {
    updateButtonClick(task);
  };
  return (
    <tr className={classes.task_item}>
      <td>
        <Link to="task" state={{ classId: params.id, taskId: task._id, taskName: task.title }}>{task.title}</Link>
      </td>
      <td>{moment(task.createdAt).calendar()}</td>
      <td>{moment(task.dateExp).format('MMMM Do YYYY, h:mm a')}</td>
      <td>{task.category}</td>
      {/* update later for db update logic */}
      <td>{moment().isBefore(task.dateExp) ? 'Active' : 'Completed'}</td>

      <td>
        <button
          type="button"
          className={classes.deleteBtn}
          onClick={() => deleteTask(task._id)}
        >
          Delete
        </button>

        <button
          type="button"
          className={classes.updateBtn}
          onClick={openUpdateform}
        >
          Update
        </button>
      </td>

    </tr>
  );
}

export default TaskItem;
