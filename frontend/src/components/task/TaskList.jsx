import axios from 'axios';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

import { useParams } from 'react-router-dom';
import TaskItem from './TaskItem';
import classes from './TaskList.module.scss';
import Modal from 'react-modal';
import { AiFillPlusCircle } from "react-icons/ai";
import { useLocation } from 'react-router-dom';

function TaskList(taskData) {
  const [taskList, setTaskList] = useState([]);
  const [newTask, setNewTask] = useState({});
  const params = useParams();
  const location = useLocation();
  let count= 1;
  let subtitle;

  // fetch task base on class id
  const getTasks = async () => {
    try {
      // const { data } = await axios.get(`/api/tasks/${params.id}`);
      // if (data) {
      //   setTaskList(
      //     data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      //   );
      // }
      console.log('loob ng class');
    } catch (err) {
      console.log(err);
    }
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModalNew() {
    setNewTask({});
    setIsOpen(true);
  }

  function openModalUpdate() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f5f5f5';
  }

  function closeModal() {
    setIsOpen(false);
  }

  // useEffect(() => {
  //   getTasks();
  // }, []);

  // useEffect(() => {
  // }, [newTask]);
  useEffect(() => {
  }, [taskData]);


  const updateButtonClick = async (eachTask) => {
    await setNewTask(eachTask);
    openModalUpdate();
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
      const { data } = await axios.post('/api/tasks/', taskData, {headers:{"Content-Type" : "application/json"}});
      toast.success('New task added');
      setNewTask('');
      setTaskList([{ ...data }, ...taskList]);
      setIsOpen(false);
    } catch (err) {
      console.log(err.response.data);
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
      <div className={classes.title}>


      <h1 className={classes.pageTitle}>Task List </h1>
      <h4 className={classes.classTitle}>{location.state.className}</h4>
      </div>
        <div className={classes.containerflex}>
         <a href="/">Class  </a>
         <p> Task </p>
        </div>

{/* modal */}
<div className={classes.action}>
          <button onClick={openModalNew} type="button" className={classes.addNew}>
          <AiFillPlusCircle/>
          <p>&nbsp;Task</p>
          </button>
          </div>



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
              {newTask._id ? 'Updating task': 'Creating New Task'}
              </h1>
              <form className={classes.addNewForm} onSubmit={newTask._id ? updateTask : addNewTask}>
          <label htmlFor="title">
            Enter Title:
            <input name="title" type="text" placeholder="Title" id="title" defaultValue={newTask.title?newTask.title: ''} required />
          </label>

          <label htmlFor="category">
            Enter Category:
            <input name="category" type="text" placeholder="Category eg. Programming" defaultValue={newTask.category?newTask.category: ''} id="category" />
          </label>

          <label htmlFor="dateExp">
            Enter Validity/Expiration for task:
            <input name="dateExp" type="datetime-local" defaultValue={newTask.dateExp?moment(newTask.dateExp).format("YYYY-MM-DDTkk:mm"): ''} id="dateExp" required />
          </label>
          <button type="submit"> <AiFillPlusCircle/> &nbsp; Add</button>
        </form>



          </Modal>
      {taskList.length > 0 ? (
        <div className={classes.tableContainer}>  

        <table className={classes.taskList_table}>
          <tbody>
            <tr>
              <td>Count</td>
              <td>Title</td>
              <td>Date Created</td>
              <td>Validity</td>
              <td>category</td>
              <td>Status</td>
              <td>Action</td>
            </tr>
            {taskList.map((task) => (
              <TaskItem key={task._id} task={task} count = {count++} deleteTask={deleteTask} updateButtonClick={updateButtonClick} />
            )
            )}
          </tbody>
        </table>
        </div>
      ) : (
        'No Task Found. Create a new task'
      )}
    </div>
  );
}

export default TaskList;
