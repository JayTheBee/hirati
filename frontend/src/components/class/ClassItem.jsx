import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AiFillDelete, AiFillEdit, AiFillFileAdd } from 'react-icons/ai';
import classes from './ClassItem.module.scss';

function ClassItem({ eachClass, deleteClass, updateButtonClick }) {
  const openUpdateform = async (e) => {
    updateButtonClick(eachClass);
  };
  return (
    <tr className={classes.task_item}>
      <td>
        <Link to={`class/${eachClass._id}`} state={{ classId: eachClass.id, className: eachClass.className }}>
          {' '}
          <p className={classes.links}>{eachClass.className}</p>
        </Link>
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
        {/* <p>{eachClass.studentEmail}</p> */}
        { eachClass.teamCode}

      </td>

      <td>
        <div className={classes.action}>
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
            onClick={() => deleteClass(eachClass._id)}
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

export default ClassItem;
