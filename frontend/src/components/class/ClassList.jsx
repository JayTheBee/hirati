import axios from 'axios';
import React, { useState, useEffect } from 'react';

import toast from 'react-hot-toast';

import ClassItem from './ClassItem';
import classes from './ClassList.module.scss';

function ClassList() {
  const [classList, setClassList] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isUpdatingNew, setIsUpdatingNew] = useState(false);
  const [dataSaved, setData] = useState({ className: '', studentEmail: [] });

  // class fetch
  const getClass = async () => {
    try {
      const { data } = await axios.get('/api/class/myClass');
      setClassList(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getClass();
  }, []);

  useEffect(() => {
    console.log(dataSaved);
  }, [dataSaved]);

  const addNewButtonClick = () => {
    setIsAddingNew(!isAddingNew);
    setIsUpdatingNew(false);
  };

  const addNewClass = async (e) => {
    e.preventDefault();
    const classData = {
      className: e.target.className.value,
      studentEmail: e.target.studentEmail.value,
    };
    classData.studentEmail = classData.studentEmail.split(',').map((item) => item.trim()).filter((a) => a);

    if (classData.className.length <= 0) {
      toast.error('Please enter Classname');
    }
    try {
      const { data } = await axios.post('/api/class/', classData);
      toast.success('Class Created Succesfully');
      setIsAddingNew(false);
      e.target.className.value = '';
      e.target.studentEmail.value = '';
      setClassList([{ ...data }, ...classList]);
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  const deleteClass = async (id) => {
    try {
      // console.log(`/api/class/${id}`);
      await axios.delete(`/api/class/${id}`);
      toast.success('Class deleted');
      setClassList(classList.filter((eachClass) => eachClass._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const cancleButtonClick = () => {
    setIsUpdatingNew(false);
  };
  const updateButtonClick = async (eachClass) => {
    await setData(eachClass);
    setIsUpdatingNew(!isUpdatingNew);

    await window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // console.log(dataSaved);
  };

  const updateClass = async (e) => {
    e.preventDefault();
    setIsUpdatingNew(false);
    setIsAddingNew(false);
    const classData = {
      className: e.target.className1.value,
      studentEmail: e.target.studentEmail1.value,
    };
    classData.studentEmail = classData.studentEmail.split(',').map((item) => item.trim()).filter((a) => a);

    if (classData.className.length <= 0) {
      toast.error('Please enter Classname');
    }
    try {
      await axios.put(`/api/class/${dataSaved._id}`, classData);
      toast.success('Class Updated Succesfully');
      getClass();
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Class List </h1>
      <hr />
      <div className={classes.containerflex}>
        <p> Class </p>
      </div>

      <div className={classes.topBar}>
        <button
          type="button"
          className={classes.addNew}
          onClick={addNewButtonClick}
        >
          Add New
        </button>
      </div>
      {isAddingNew && (
        <form className={classes.addNewForm} onSubmit={addNewClass}>
          <input name="className" type="text" placeholder="Classname" />
          <textarea type="textarea" name="studentEmail" rows="10" placeholder="Enter Student Email Participants with comma seperated. Eg. Juan@gmail.com, Maria@gmail.com " />
          <button type="submit">Add</button>
        </form>
      )}

      {isUpdatingNew && (
        <form className={classes.addNewForm} onSubmit={updateClass}>

          <input name="className1" type="text" defaultValue={dataSaved.className} placeholder="Enter Classname" />
          <textarea type="textarea" name="studentEmail1" rows="10" placeholder="Enter Student Email Participants with comma seperated. Eg. Juan@gmail.com, Maria@gmail.com " defaultValue={dataSaved.studentEmail.map((each) => `${`${each},`} `)} />
          <button type="submit">Update</button>
          <button onClick={cancleButtonClick} type="button" className={classes.addNew}>Cancel</button>
        </form>
      )}

      {classList.length > 0 ? (
        <table className={classes.taskList_table}>

          <tbody>
            <tr>
              <td>Classname</td>
              <td>Date Created</td>
              <td>List Of Student Participants Email</td>
              <td>Number of Students</td>
              <td>Action</td>
            </tr>
            {classList.map((each) => (
              <ClassItem
                key={each._id}
                eachClass={each}
                deleteClass={deleteClass}
                updateButtonClick={updateButtonClick}
              />
            ))}
          </tbody>
        </table>
      ) : (
        'No Class Found. Create a new class'
      )}
    </div>
  );
}

export default ClassList;
