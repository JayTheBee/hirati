import axios from 'axios';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

import { useParams } from 'react-router-dom';
import TaskItem from './TaskItem';
import classes from './TaskList.module.scss';
import Modal from 'react-modal';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
<script
  src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
  crossorigin>
</script>

function TaskList(taskData) {
	const [taskList, setTaskList] = useState([]);
	const [newTask, setNewTask] = useState({});
	const params = useParams();
	const location = useLocation();
	let count = 1;	
	let userData = JSON.parse(localStorage.getItem('user'));

	// fetch task base on class id
	const getTasks = async () => {
		try {
			const { data } = await axios.get(`/api/tasks/${params.id}`);
			// console.log(data);
			if (data) {
				setTaskList(
					data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
				);
			}
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

	function closeModal() {
		setIsOpen(false);
	}

	useEffect(() => {
		getTasks();
	}, []);

	const updateButtonClick = async eachTask => {
		await setNewTask(eachTask);
		openModalUpdate();
	};

	const addNewTask = async e => {
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
			setNewTask('');
			setTaskList([{ ...data }, ...taskList]);
			setIsOpen(false);
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
		if (moment().isBefore(taskData.dateExp)) taskData.completed = false;
		if (taskData.length <= 0) {
			toast.error('Task is empty');
			return;
		}
		// console.log(newTask._id);
		try {
			const { data } = await axios.put(
				`/api/tasks/${params.id}/${newTask._id}`,
				taskData
			);
			toast.success('New task added');
			getTasks();
		} catch (err) {
			console.log(err);
		}
	};

	const deleteTask = async id => {
		try {
			await axios.delete(`/api/tasks/${params.id}/${id}`);
			toast.success('Task deleted');
			setTaskList(taskList.filter(task => task._id !== id));
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
			{/* <div className={classes.containerflex}>
				<a href="/">Class </a>
				<p> >> Task </p>
			</div> */}
	<div className='container-fluid rounded-pill px-4 py-2 ' style={{backgroundColor:'#187f524b' }} >
        <a  href="/" className='py-1  mx-2  fs-4 fw-bolder d-inline text-decoration-underline' style={{color:'wheat' }} > Class</a>
		<p className='py-1 text-white fs-4 fw-bolder d-inline '>  >>  Task </p>
    </div>
      {userData.role == 'teacher'? (		
        <>
        <div className={classes.action}>
        <button onClick={openModalNew} type="button" className={classes.addNew}>
          <AiFillPlusCircle />
          <p>&nbsp;Task</p>
        </button>
        </div>

      <Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				className={classes.modal}
				overlayClassName={classes.overlay}
				contentLabel="Assign Task"
				ariaHideApp={false}
			>
				{/* modal render */}
				<button
					onClick={closeModal}
					type="button"
					className={classes.modalClose}
				>
					{' '}
					X{' '}
				</button>
				<h1 className={classes.titleTask}>
					{newTask._id ? 'Updating task' : 'Creating New Task'}
				</h1>
				<form
					className={classes.addNewForm}
					onSubmit={newTask._id ? updateTask : addNewTask}
				>
					<label htmlFor="title">
						Enter Title:
						<input
							name="title"
							type="text"
							placeholder="Title"
							id="title"
							defaultValue={newTask.title ? newTask.title : ''}
							required
						/>
					</label>

					<label htmlFor="category">
						Enter Category:
						<input
							name="category"
							type="text"
							placeholder="Category eg. Programming"
							defaultValue={newTask.category ? newTask.category : ''}
							id="category"
						/>
					</label>

					<label htmlFor="dateExp">
						Enter Validity/Expiration for task:
						<input
							name="dateExp"
							type="datetime-local"
							defaultValue={
								newTask.dateExp
									? moment(newTask.dateExp).format('YYYY-MM-DDTkk:mm')
									: ''
							}
							id="dateExp"
							required
						/>
					</label>
					<button type="submit">
						{' '}
						<AiFillPlusCircle /> &nbsp; Add
					</button>
				</form>
			</Modal>
      </>
      ) : ( 
        // student View for task/question 
    	< >
			
      	</>

      )}

			
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
							{taskList.map(task => (
								<TaskItem
									key={task._id}
									task={task}
									count={count++}
									deleteTask={deleteTask}
									updateButtonClick={updateButtonClick}
								/>
							))}
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
