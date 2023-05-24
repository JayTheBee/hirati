import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';

import { useParams } from 'react-router-dom';
import TaskItem from './TaskItem';
import classes from './TaskList.module.scss';
import Modal from 'react-modal';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import categoryDropdown from './categoryDropdown';
import CategoryDropdown from './categoryDropdown';
<script
  src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
  crossorigin>
</script>

function TaskList(taskData) {
	const categoryRef= useRef();

	const [taskList, setTaskList] = useState([]);
	const [newTask, setNewTask] = useState({});
	const [category, setCategory] = useState('');
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
	
	const handleCategory = (cat) => {
		setCategory(cat.value);
	};

	const addNewTask = async e => {
		e.preventDefault();
		const taskData = {
			title: e.target.title.value,
			category: category,
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
			category: category,
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
			setIsOpen(false);
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
        Task
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
				<h1 className='fw-bold fs-1' style={{color:'wheat', textShadow: '2px 2px 2px rgb(90, 62, 62)'}}>
					{newTask._id ? 'Updating task' : 'Creating New Task'}
				</h1>
				<form
					className=' container'
					onSubmit={newTask._id ? updateTask : addNewTask}
				>
					<label htmlFor="title" className='fs-3 fw-bold col-12 '>
						Enter Title:
					</label>
						<input
							name="title"
							type="text"
							placeholder="Title"
							id="title"
							className='rounded-pill col-4 border-0 p-3 fs-5 d-block w-50'
							defaultValue={newTask.title ? newTask.title : ''}
							required
						/>

					<label htmlFor="category" className='fs-3 fw-bold col-4 mt-2 '>
						Enter Category:
					</label>
					<CategoryDropdown ref={categoryRef} onSelectChange={handleCategory} passValue={newTask.category ? newTask.category : ''}></CategoryDropdown>

					<label htmlFor="dateExp" className='fs-3 fw-bold col-12 mt-2'>
						Enter Validity/Expiration for task:
					</label>
						<input
							name="dateExp"
							type="datetime-local"
							defaultValue={
								newTask.dateExp
									? moment(newTask.dateExp).format('YYYY-MM-DDTkk:mm')
									: ''
							}
							id="dateExp"
							className='rounded-pill m-2 col-4 border-0 p-3 fs-5'
							required
						/>
						<div className='container mt-4'>
							<button type="submit" className='w-25 btn btn-success rounded p-3 border-bottom fs-4'>
								{' '}
								<AiFillPlusCircle /> &nbsp; Add/Update
							</button>
						</div>
				</form>
			</Modal>
      </>
      ) : ( 
        // student View for task/question 
    	< >
			
      	</>

      )}

			
			{taskList.length > 0 ? (
				<div className='d-grid container-fluid fs-5 px-4 gap-4 overflow-auto'>
					<table className={classes.taskList_table}>
						<tbody >
							<tr className='my-2 fw-bold'>
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
