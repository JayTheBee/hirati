import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import classes from './QuestionItem.module.scss';

function QuestionItem({ question, deleteQuestion, updateButtonClick }) {
  // const params = useParams();
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
      <td><p>{question.questionNumber}</p></td>
      <td>
        <p>{question.description}</p>
      </td>
      <td><p>{question.performance.memory}</p></td>
      <td><p>{question.performance.cputime}</p></td>
      <td>

        {question.testcase.input.map((each) => (
          <p key={each}>
            {`${each} `}
          </p>
        ))}

      </td>
      <td>

        {question.testcase.output.map((each) => (
          <p key={each}>
            {`${each} `}
          </p>
        ))}

      </td>

      <td>
        {question.example.map((each) => (
          <p key={each}>
            {`${each} `}
          </p>
        ))}

      </td>
      <td>

        {question.constraints.map((each) => (
          <p key={each}>
            {`${each} `}
          </p>
        ))}

      </td>
      <td>
        <button
          type="button"
          className={classes.deleteBtn}
          onClick={() => deleteQuestion(question._id)}
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
