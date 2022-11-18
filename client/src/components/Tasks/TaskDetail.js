import ReactMarkdown from "react-markdown"



const TaskDetail = ({task}) => {
	const caseArr = []
	if(task.case){
		for (const [index, value] of task.case.entries()){
			caseArr.push(
				<div key={value._id}>
					<p>Case {index + 1}</p>
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
			<h4>desc: <ReactMarkdown children={task.desc} /></h4>	
			<p>Memory Constraints: {task.perf.memory}</p>
			<p>Time Constraints: {task.perf.cputime}</p>
			<p>Score: {task.score}</p>
			{caseArr}
			<p>Examples: <br />{task.examples.join(' ')}</p>
			<p>Constraints: <br />{task.constraints.join(' ')}</p>
			<br></br>
			<br></br>
		</div>
	)
}

export default TaskDetail