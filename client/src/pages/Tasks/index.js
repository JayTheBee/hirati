import { useEffect, useState } from "react"
// import axios from "axios"
import TaskDetail from "../../components/Tasks/TaskDetail"
import TaskForm from "../../components/Tasks/TaskForm"

const Task = () => {
	const [tasks, setTask] = useState('')
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchTasks = async () => {
			const response = await fetch('http://localhost:3005/api/tasks')
			const json = await response.json()
	 
			if (response.ok) {
				setTask(json)
		//     console.log('resonse is ok', json)
			}
			if(!response.ok){
				setError(json.error)
			// console.log(json.error)
			}
		}
	 
		fetchTasks()
	   }, [])

	return (
	  <div className="task">
	    <h2>Task route</h2>

	    <h2>GET all Tasks</h2>
		{tasks && tasks.map(taskChild =>(
			<TaskDetail task={taskChild} key={taskChild._id}/>
		))}
		{error && <div className="error"><h3>{error}</h3></div>}
		<h1>POST: Add new Task</h1>

		<TaskForm />
	  </div>

	)
   }
   
   export default Task