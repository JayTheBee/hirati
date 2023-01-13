import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
import classes from './ClassItem.module.scss';

function ClassItem({ eachClass, deleteClass, updateButtonClick }) {
  // const [isCompleted, setIsCompleted] = useState(eachClass.completed);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setisUpdating] = useState(false);
  const [classData, setclassData] = useState({});
  // const [count, setcount] = useState(1);

  const openUpdateform = async () => {
    // setisUpdating(!isUpdating);
    updateButtonClick(eachClass);
    // setclassData(classData => ({
    //   ...classData,
    //   ...updatedValue,
    // }))
    // console.log(classData);
  };

  return (
    <tr className={classes.task_item}>
      <td className={classes.task_name}>
        <p>{eachClass.className}</p>
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
      {/* {isUpdating && (
        <td>
          <form className={classes.addNewForm} onSubmit={updateClass(eachClass)}>
            <input
              name="className"
              type="text"
              placeholder="Enter Classname"
              defaultValue={eachClass.className}
            />
            <textarea type="textarea" name="studentEmail" rows="10" placeholder="Enter Student Email Participants with comma seperated. Eg. Juan@gmail.com, Maria@gmail.com " defaultValue={eachClass.studentEmail.map((each) => `${`${each},`} `)} />
            <button type="submit">Add</button>
          </form>
        </td>
      )} */}
    </tr>
  );
}

export default ClassItem;
