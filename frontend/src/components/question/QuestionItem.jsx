import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import classes from './QuestionItem.module.scss';

function QuestionItem({ question, deleteTask, updateButtonClick }) {
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
    updateButtonClick(question);
  };

  return (
    <tr className={classes.task_item}>
      <td className={classes.task_name}>
        <p>{question.description}</p>

      </td>
      <td><p>{question.performance.cputime}</p></td>
      <td><p>{question.performance.memory}</p></td>
      <td><p>{question.performance.score}</p></td>
      <td>{moment(question.createdAt).calendar()}</td>
      <td>{moment(question.dateExp).format('MMMM Do YYYY, h:mm a')}</td>
      <td>{question.category}</td>
      {/* update later for db update logic */}
      {/* <td>{moment().isBefore(question.dateExp) ? 'Active' : 'Completed'}</td> */}

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

export default QuestionItem;
