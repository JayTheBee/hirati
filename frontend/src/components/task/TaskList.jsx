import axios from 'axios';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

import { useParams } from 'react-router-dom';
import TaskItem from './TaskItem';
import classes from './TaskList.module.scss';

function TaskList() {
  const [taskList, setTaskList] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isUpdatingNew, setIsUpdatingNew] = useState(false);
  const [newTask, setNewTask] = useState({});
  const params = useParams();

  // fetch task base on class id
  const getTasks = async () => {
    try {
      const { data } = await axios.get(`/api/tasks/${params.id}`);
      if (data) {
        setTaskList(
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        );
      }
      // console.log();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
  }, [newTask]);


  const addNewButtonClick = () => {
    setIsAddingNew(!isAddingNew);
    setIsUpdatingNew(false);
  };

    const cancleButtonClick = () => {
    setIsUpdatingNew(false);
  };

  const updateButtonClick = async (eachTask) => {
    await setNewTask(eachTask);
    await setIsAddingNew(false);
    setIsUpdatingNew(!isUpdatingNew);
    await window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  const addNewTask = async (e) => {
    e.preventDefault();
    const taskData = {
      title: e.target.title.value,
      category: e.target.category.value,
      dateExp: e.target.dateExp.value,
      classId: params.id,
      completed: false,
    };
    if (taskData.length <= 0) {
      toast.error('Task is empty');
      return;
    }
    try {
      const { data } = await axios.post('/api/tasks/', taskData);
      toast.success('New task added');
      setIsAddingNew(false);
      setNewTask('');
      setTaskList([{ ...data }, ...taskList]);
    } catch (err) {
      console.log(err);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    
    const taskData = {
      title: e.target.title.value,
      category: e.target.category.value,
      dateExp: e.target.dateExp.value,
      classId: params.id,
      completed: true,
    };
    if(moment().isBefore(taskData.dateExp))
      taskData.completed =  false;
    if (taskData.length <= 0) {
      toast.error('Task is empty');
      return;
    }
    // console.log(newTask._id);
    try {
      const { data } = await axios.put(`/api/tasks/${params.id}/${newTask._id}`, taskData);
      toast.success('New task added');
      setIsUpdatingNew(false);
      // setNewTask('');
      getTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${params.id}/${id}`);
      toast.success('Task deleted');
      setTaskList(taskList.filter((task) => task._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <hr></hr>
      <div className={classes.containerflex}>
      <a href="/">Class  </a>
      <p> >> Task </p>
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
        <form className={classes.addNewForm} onSubmit={addNewTask}>
          <label htmlFor="title">
            Enter Title:
            <input name="title" type="text" placeholder="Title" id="title" required />
          </label>

          <label htmlFor="category">
            Enter Category:
            <input name="category" type="text" placeholder="Category eg. Programming" id="category" />
          </label>

          <label htmlFor="dateExp">
            Enter Validity/Expiration for task:
            <input name="dateExp" type="datetime-local" id="dateExp" required />
          </label>
          <button type="submit">Add</button>
        </form>
      )}
      
      {isUpdatingNew && (
        <form className={classes.addNewForm} onSubmit={updateTask}>
        <label htmlFor="title">
          Enter Title:
          <input name="title" type="text" placeholder="Title" defaultValue={newTask.title} id="title" required />
        </label>

        <label htmlFor="category">
          Enter Category:
          <input name="category" type="text" placeholder="Category eg. Programming"defaultValue={newTask.category} id="category" />
        </label>

        <label htmlFor="dateExp">
          Enter Validity/Expiration for task:
          <input name="dateExp" type="datetime-local" defaultValue={moment(newTask.dateExp).format("YYYY-MM-DDTkk:mm")} id="dateExp" required />
        </label>
        <button type="submit">Add</button>
        <button type="button" onClick={cancleButtonClick}>cancel</button>
      </form>
      )} 
      {taskList.length > 0 ? (
        <table className={classes.taskList_table}>
          <tbody>
            <tr>
              <td>Title</td>
              <td>Date Created</td>
              <td>Validity</td>
              <td>category</td>
              <td>Status</td>
              <td>Action</td>
            </tr>
            {taskList.map((task) => (
              <TaskItem key={task._id} task={task} deleteTask={deleteTask} updateButtonClick={updateButtonClick} />
            ))}
          </tbody>
        </table>
      ) : (
        'No Task Found. Create a new task'
      )}
    </div>
  );
}

export default TaskList;
