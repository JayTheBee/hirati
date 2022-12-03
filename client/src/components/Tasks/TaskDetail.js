import ReactMarkdown from "react-markdown"



const TaskDetail = ({task}) => {
	const caseArr = []
	if(task.casevar){
		for (const [index, value] of task.casevar.entries()){
			caseArr.push(
				<div key={index}>
					<b>I/O Test Case {index + 1}: </b>
					<p>Input: {value.input}</p>
					<p>Output: {value.output}</p>
				</div>
			)
		}
	}


	return(
		<div className="task-detail" >
			<br></br>
			<br></br>
			<h4>Title: {task.title}</h4>
			<h4>Description: </h4>	
			<ReactMarkdown children={task.desc} />
			<p>Memory Constraints: {task.perf.memory} kilobytes</p>
			<p>Time Constraints: {task.perf.cputime} seconds</p>
			<p>Score: {task.score}</p>
			{caseArr}
			<h4>Examples: </h4>
			<p> {task.example.join(`\n`)} </p> 
			<h4>Constraints: </h4>
			<p> {task.constraint.join(`\n`)}</p>

		</div>
	)
}

export default TaskDetail