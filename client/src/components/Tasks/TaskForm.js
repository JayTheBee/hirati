import { useState } from 'react'


const TaskForm = () => {
	const [title, setTitle] = useState('')
	const [desc, setDesc] = useState('')
	const [perf, setPerf] = useState({ cputime: 0, memory: 0})
	const [score, setScore] = useState(0)
	const [casevar, setCase] = useState([{input: '', output:''}])


	const [example, setExample] = useState([""])

	const [constraints, setConstraint] = useState([""])

	const [error, setError] = useState(null)

	const removeCaseFields = async(index) => {
		let newCase = [...casevar]
		newCase.splice(index, 1)
		setCase(newCase)
	}

	const addCaseFields = async() => {
		setCase([...casevar, { input:'', output:'' }])
	}

	const handleCase = async(index, e) => {
		let newCase = [...casevar]
		newCase[index][e.target.name] = e.target.value
		setCase(newCase)
	}




	const handleExample = async(index, e) => {
		example.splice(index, 1, e.target.value)
		setExample([...example])
	}
	const removeExampleFields = async(index) => {
		let newExample = [...example]
		newExample.splice(index, 1) 
		setExample(newExample)
	}
	const addExampleFields = async() => {
		console.log(example)
		setExample([...example, ""])
		// setExample("")
	}




	const removeConstraintFields = async(index) => {
		let newConstraint = [...constraints]
		newConstraint.splice(index, 1) 
		setConstraint(newConstraint)
	}

	const addConstraintFields = async() => {
		console.log(constraints)
		setConstraint([...constraints, ""])

	}
	const handleConstraint = async(index, e) => {
		constraints.splice(index, 1, e.target.value)
		setConstraint([...constraints])
	}



	const handleSubmit = async (e) => {
		e.preventDefault()
	 
		const task = {title, desc, perf, score, casevar, example, constraints}
		
		const response = await fetch('http://localhost:3005/api/tasks', {
		  method: 'POST',
		  body: JSON.stringify(task),
		  headers: {
		    'Content-Type': 'application/json'
		  }
		})
		const json = await response.json()
	 
		if (!response.ok) {
		  setError(json.error)
		}
		if (response.ok) {
		  setError(null)
		  console.log('new task added:', json)
		  
		}
	 
	   }
	 


	return(
		<form className="create" onSubmit={handleSubmit}> 

	
			<label>Task Title:</label>
			<input 
			type="text" 
			onChange={(e) => setTitle(e.target.value)} 
			value={title}
			/>
			<br/>

			<label>Task Desc:</label>
			<input 
			type="text" 
			onChange={(e) => setDesc(e.target.value)} 
			value={desc}
			/>
			<br/>

			<label>Memory Performance Constraints:</label>
			<input 
			type="text" 
			onChange={(e) => setPerf({...perf, memory: e.target.value})} 
			value={perf.memory}
			/>
			<br/>

			<label>CPU Time Performance Constraints:</label>
			<input 
			type="text" 
			onChange={(e) => setPerf({...perf, cputime: e.target.value})} 
			value={perf.cputime}
			/>
			<br/>

			<label>Score:</label>
			<input 
			type="text" 
			onChange={(e) => setScore(e.target.value)} 
			value={score}
			/>
			<br/>
			
			<h3>Cases:</h3>
			{casevar.map((element, index) => (
				<div className='case-form' key={index}>
					<label>Case Input:</label>
					<input 
					type="text" 
					name="input"
					onChange={(e) => handleCase(index, e)} 
					value={element.input}
					/>
					<br/>

					<label>Case Output:</label>
					<input 
					type="text" 
					name="output"
					onChange={(e) => handleCase(index, e)} 
					value={element.output}
					/>
					<br/>
					<br/>

					{index ? <button type="button"  className="button remove" onClick={() => removeCaseFields(index)}>Remove</button>  : null}
					<br/>
					<br/>

				</div>
			))}

			<button className="button add" type="button" onClick={() => addCaseFields()}>Add More Cases</button>
			<br/>
			<br/>
			
			<h3>Examples:</h3>

			{example.map( (element, index)=> (
				<div className="example" key={index}>
					<label>Example {index + 1}:</label>
					<input 
					type="text" 
					name="example"
					onChange={(e) => handleExample(index, e)} 
					value={element}
					/>
					<br/>	
					<br/>

					{index ? <button type="button"  className="button remove" onClick={() => removeExampleFields(index)}>Remove</button>  : null}	

					<br/>
					<br/>		
				</div>
			))}

			<button className="button add" type="button" onClick={addExampleFields}>Add More Examples</button>
			<br/>
			<br/>


			<h3>Constraints:</h3>

			{constraints.map( (element, index)=> (
				<div className="constraint" key={index}>
					<label>Constraint {index + 1}:</label>
					<input 
					type="text" 
					name="constraint"
					onChange={(e) => handleConstraint(index, e)} 
					value={element}
					/>
					<br/>	
					<br/>

					{index ? <button type="button"  className="button remove" onClick={() => removeConstraintFields(index)}>Remove</button>  : null}	

					<br/>
					<br/>		
				</div>
			))}

			<button className="button add" type="button" onClick={addConstraintFields}>Add More Constraints</button>
			<br/>
			<br/>

			<button  type="submit">Add Task</button>
			{error && <div className="error"><h1>{error}</h1></div>}
    		</form>

	)
}

export default TaskForm