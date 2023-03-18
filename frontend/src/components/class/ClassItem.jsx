import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import classes from './ClassItem.module.scss';

function ClassItem({ eachClass, deleteClass, updateButtonClick }) {
  const openUpdateform = async (e) => {
    updateButtonClick(eachClass);
  };
  // const handleClick = () => {
  //   // console.log(`class/${eachClass._id}`);
  //   // route to class->task
  //   window.location.href = `class/${eachClass._id}`;
  // };

  return (
    <tr className={classes.task_item}>
      <td className={classes.task_name}>
        <a href={`class/${eachClass._id}`}>

          <p>{eachClass.className}</p>
        </a>
      </td>

      <td>{moment(eachClass.createdAt).calendar()}</td>

      <td>
        {/* <p>{eachClass.studentEmail}</p> */}
        {/* first five only */}
        { eachClass.studentEmail.slice(0, 5).map((each) => `${`${each},`} `)}

      </td>
      <td>
        {/* <p>{eachClass.studentEmail}</p> */}
        { eachClass.studentEmail.length}

      </td>

      <td>
        <button
          type="button"
          className={classes.deleteBtn}
          onClick={() => deleteClass(eachClass._id)}
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

export default ClassItem;
