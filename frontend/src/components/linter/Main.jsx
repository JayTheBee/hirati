//api call to a backend process
import axios from 'axios'
import { useState } from 'react'


const lintOutput = ({resultArr}) => {
	if(resultArr.status === 0){
		return(
			<>
			<h2>{resultArr.message}</h2>
			</>
		)
	}else if(resultArr.status === 1){
		resultArr.map((e) => {
			return(<>
			<h2>{e.message}</h2>
			</>)
		})

	}else{
		return(
			<>
			<h2>{resultArr.message}</h2>			
			</>
		)
	}
}

const LintCall = ({code, lang}) => {
	const [lintRes, setLintRes] = useState()
	
	const handleSubmit = async () => {
		const conf = { 'Content-Type': 'application/json' }
		const payload = {'code': code }
		const { data } = await axios.post(`/api/lint/${lang.name}`, payload, {"headers": conf})
		console.log("data is ", data)
		setLintRes(data)
	}
	return(
	<>
			<button  type="submit" onClick={handleSubmit}>Lint</button>
	</>
	)
	
}



export default LintCall