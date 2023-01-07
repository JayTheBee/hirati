import { useState } from 'react'
import ReactMarkdown from 'react-markdown'


const ExampleField = ({example, setExample}) => {

	const handleExampleChange = (index, e) => {
		example.splice(index, 1, e.target.value)
		setExample([...example])
	}
	const removeExampleFields = (index) => {
		let newExample = [...example]
		newExample.splice(index, 1) 
		setExample(newExample)
	}
	const addExampleFields = () => {
		setExample([...example, ""])
	}
	return(
		<>
			{example.map( (element, index)=> (
				<div className="example" key={index}>
					<label>Example {index + 1}: </label>
					<input type="text" name="example" value={element}
					onChange={(e) => handleExampleChange(index, e)} />

					{index ? 
						<button type="button"  className="button remove" onClick={() => removeExampleFields(index)}>Remove</button>  
					: null}	
 
					<br/>
				</div>
			))}
			<button className="button add" type="button" onClick={addExampleFields}>Add More Examples</button>
			<br/>
			<br/>
		</>
		
	)
}


const CaseField = ({casevar, setCase}) => {
	const [activeInput, setActiveInput] = useState([true])

	const removeCaseFields = (index) => {
		let newCase = [...casevar]
		newCase.splice(index, 1)
		setCase(newCase)

		let newActive = [...activeInput]
		newActive.splice(index, 1)
		setActiveInput(newActive)
	}

	const addCaseFields = () => {
		setCase([...casevar, { input:'', output:'' }])
		setActiveInput([...activeInput, true])
	}

	const handleCaseChange = (index, e) => {
		let newCase = [...casevar]
		newCase[index][e.target.name] = e.target.value
		setCase(newCase)
	}

	const handleActiveChange = (index, bool) => {
		let newActiveArr = [...activeInput]
		newActiveArr[index] = bool
		setActiveInput(newActiveArr)

		if(!bool) {
			let newCase = [...casevar]
			newCase[index].input = ''
			setCase(newCase)			
		}
	}

	const inputField = (element, index) => {

		if(activeInput[index]){
			return(
				<div className="case-input" key={index}>
					
					<label>Input: </label>
					<input type="text" name="input" placeholder="per newline" value={element.input}
					onChange={(e) => handleCaseChange(index, e)} />
					<button className="button add" type="button" onClick={() => handleActiveChange(index, false)}>No Input</button>
				</div>
			)
		} 
		return(
			<>
				<button className="button add" type="button" onClick={() => handleActiveChange(index, true)}>Add Input</button>
				<br />
			</>

		)
			
	
	}

	//Render
	return(
		<>
			{casevar.map((element, index) => (
				<div className='case-form' key={index}>
					<p>Case {index + 1}: </p>
					{inputField(element, index)}

					<label>Output:</label>
					<input type="text" name="output" value={element.output}
					onChange={(e) => handleCaseChange(index, e)} />
					<br/>

					{index ? 
						<button type="button"  className="button remove" onClick={() => removeCaseFields(index)}>Remove Case</button>  
					: null}
					<br/>
					<br/>

				</div>
			))}

			<button className="button add" type="button" onClick={() => addCaseFields()}>Add More Cases</button>

		</>

		
	)
}


const ConstraintField = ({constraint, setConstraint}) => {

	const removeConstraintFields = (index) => {
		let newConstraint = [...constraint]
		newConstraint.splice(index, 1) 
		setConstraint(newConstraint)
	}

	const addConstraintFields = () => {
		setConstraint([...constraint, ""])

	}
	const handleConstraintChange = (index, e) => {
		constraint.splice(index, 1, e.target.value)
		setConstraint([...constraint])
	}

	return(
		<>
			{constraint.map( (element, index)=> (

				<div className="constraint" key={index}>

					<label>Constraint {index + 1}: </label>
					<input type="text" name="constraint" value={element}
					onChange={(e) => handleConstraintChange(index, e)} />

					{index ? 
						<button type="button"  className="button remove" onClick={() => removeConstraintFields(index)}>Remove</button>  
					: null}	

					<br/>
					<br/>	

				</div>

			))}

			<button className="button add" type="button" onClick={addConstraintFields}>Add More Constraints</button>
			<br/>
			<br/>		
		</>		
	)
}


const DescField = ({desc, setDesc}) => {
	return( 
		<>
			<textarea type="text" value={desc} placeholder="Enter Markdown Description"
			onChange={(e) => setDesc(e.target.value)} />
			<br/>
			<ReactMarkdown children={desc}/> 
		</>
	)
}

const TaskForm = ({tasks, setTask}) => {
	const [title, setTitle] = useState('')
	const [desc, setDesc] = useState('')
	const [perf, setPerf] = useState({ cputime: 0, memory: 0})
	const [score, setScore] = useState(0)
	const [casevar, setCase] = useState([{input: '', output:''}])
	const [example, setExample] = useState([""])
	const [constraint, setConstraint] = useState([""])
	const [error, setError] = useState(null)


	const handleSubmit =  async(e) => {
		e.preventDefault()
		
		const newTask = { title, desc, perf, score, casevar, example, constraint }
		
		
		console.log("after fetch task is ", newTask)

		const response = await fetch('http://localhost:3005/api/tasks', {
		  method: 'POST',
		  body: JSON.stringify(newTask),
		  headers: {
		    'Content-Type': 'application/json'
		  }
		})
		
		const json = await response.json()
	 
		if (!response.ok) {
		  setError(json.error)
		  console.log("err response is ", error)
		}
		if (response.ok) {
		  setError(null)
		  setTask([...tasks, newTask])
		  console.log('new task added:', json)
		  
		}

	}
	 


	return(
		<form className="create" onSubmit={handleSubmit}> 

			<label>Task Title: </label>
			<input type="text" value={title}
			onChange={(e) => setTitle(e.target.value)} />
			<br/>

			<label>Task Desc: </label>
			<DescField desc={desc} setDesc={setDesc}/>

			<label>Memory Performance Constraints: </label>
			<input type="text" value={perf.memory} placeholder="in kilobytes"
			onChange={(e) => setPerf({...perf, memory: e.target.value})} />
			<br/>

			<label>Runtime Performance Constraints: </label>
			<input type="text" value={perf.cputime} placeholder="in seconds"
			onChange={(e) => setPerf({...perf, cputime: e.target.value})} />
			<br/>

			<label>Total Score: </label>
			<input type="text" value={score}
			onChange={(e) => setScore(e.target.value)} />
			<br/>
			
			<h3>I/O Test Cases: </h3>
			<CaseField casevar={casevar} setCase={setCase} />
			
			<h3>Examples: </h3>
			<ExampleField example={example} setExample={setExample} />

			<h3>Constraints: </h3>
			<ConstraintField constraint={constraint} setConstraint={setConstraint} />


			<button  type="submit">Add Task</button>
			{error && <div className="error"><h1>{error}</h1></div>}
    		</form>

	)
}

export default TaskForm