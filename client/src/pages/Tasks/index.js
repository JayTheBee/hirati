import { useEffect, useState } from "react"
// import axios from "axios"
import TaskDetail from "../../components/Tasks/TaskDetail"
import TaskForm from "../../components/Tasks/TaskForm"

const Task = () => {
	const [tasks, setTask] = useState([])
	const [error, setError] = useState(null)

	
	useEffect(() => {
		const fetchTasks = async () => {
			const response = await fetch('http://localhost:3005/api/tasks')
			const json = await response.json()
	 
			if (response.ok) {
				setTask(json)
		    		console.log('response is ok ', json)
			}
			if(!response.ok){
				setError(json.error)
				console.log("err is ", json.error)
			}
		}
		fetchTasks()
	}, [])
	console.log("TASKS is ", tasks)

	return (
	  <div className="task">
	    <h2>Task route</h2>

	    <h2>GET: all Tasks</h2>
		{tasks && tasks.map((element, index) =>(
			<TaskDetail task={element} key={index}/>
		))}
		{error && <div className="error"><h3>{error}</h3></div>}
		<br /><br /><br />
		<h1>POST: Add new Task</h1>
		<TaskForm tasks={tasks} setTask={setTask}/>
	  </div>

	)
   }
   
   export default Task