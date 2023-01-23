import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import classes from './TaskItem.module.scss';

function TaskItem({ task, deleteTask, updateButtonClick }) {
  const params = useParams();
  // const [isCompleted, setIsCompleted] = useState(task.completed);
  // const [isLoading, setIsLoading] = useState(false);

  // const handleCheckboxClick = async () => {
  //   try {
  //     setIsLoading(true);
  //     await axios.put(`/api/tasks/${task._id}`, {
  //       completed: !isCompleted,
  //     });
  //     setIsCompleted(!isCompleted);
  //     toast.success('Task updated successfully');
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const openUpdateform = async () => {
    updateButtonClick(task);
  };

  return (
    <tr className={classes.task_item}>
      <td className={classes.task_name}>
        <p>{task.title}</p>
        <p>{params._id}</p>

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
