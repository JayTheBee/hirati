import axios from 'axios';
import { useState } from 'react';



const OutputProcessing = ({results, isBatch}) => {
	console.log("FINAL RESULTS ARE: ", results)

	if(isBatch){	
		return(
			<>
				{results.map((element, index) => {
					return(<OutputDetails key={element.data.token} results={element.data} isBatch={isBatch} index={index}/>)
				})}
			</>
		)
	}else{
		return <OutputDetails results={results}/>
		
	}
}

const OutputDetails = ({results, isBatch, index}) => {
	return(
	<>
		{isBatch && <h1>Case {index + 1}:</h1>}
		<h2>Console Output:</h2>
		<i>{results.stdout}</i>
		<h2><b> Status:</b> {results.status.description} </h2>
		<h2><b>Runtime memory is </b>{results.memory} kb</h2>
		<h2><b>Runtime is</b> {results.time} seconds</h2>
	</>
	)   


}
   
const BatchSubmission = ({code, lang, casevar, setCode, setLang, setCase}) => {
	const [results, setResults] = useState()
	const [isBatch, setIsBatch] = useState(false)



	const handleCompile = async (e) => {
		e.preventDefault()

		console.log("ARRAY LENGTH: ", casevar.length)
		
		// Single case default
		let url = import.meta.env.VITE_JUDGE_LINK + "/submissions/"
		let data = {
			"language_id": lang.id,
			"source_code": code,
			"stdin":casevar[0].input,
			"expected_output":casevar[0].output,							
		}
		let batchBool = false

		// Conditional for Multiple test cases
		if(casevar.length > 1){
			// Process multiple payloads
			batchBool = true
			setIsBatch(true)
			const subs = casevar.map((element) => {
				return(
					{
						"language_id": lang.id,
						"source_code": code,
						"stdin":element.input,
						"expected_output":element.output,							
					}
				)
			})
			data = {submissions: subs}
			url = import.meta.env.VITE_JUDGE_LINK + "/submissions/batch"
		}

		try {
			const conf = { 'Content-Type': 'application/json' }
			const initialData = await axios.post(url, data, {"headers": conf})
			checkStatus(initialData.data, batchBool)

		} catch (error) {
			console.log(error)
		}
	}

	

	const wait =  (ms = 1000) => {
		return new Promise(resolve => {
			setTimeout(resolve, ms);
		})
	}

	const checkStatus = async (initialData, isBatch) =>{
		try {


			console.log("IS PAYLOAD A BATCH REQUEST: ", isBatch)
			// If multiple cases
			if(isBatch){

				console.log("BATCH REQUEST DATA TOKENS ARRAY: ", initialData)
				const batchURLs = initialData.map((element) => import.meta.env.VITE_JUDGE_LINK + "/submissions/" + element.token)
				console.log("SUBMISSION URLs ARE: ", batchURLs)

				// const batchRequests = batchURLs.map((url) => axios.get(url))
				const batchResponses = await Promise.all(batchURLs.map((url) => axios.get(url)))
				const batchStatuses = batchResponses.map(e => e.data.status.id)

				// If submission is done processing 
				if((!batchStatuses.includes(1)) && (!batchStatuses.includes(2))){

					console.log("BATCH RESPONSES ARE NOW: ", batchResponses)
					setResults([...batchResponses])
					setCode("")
					setLang({ name:"javascript", id:63 })
					setCase([{input: '', output:''}])
			


				// If still processing wait 3 seconds and reprocess recursively
				}else{
					console.log("BATCH RESPONSES ARE STILL: ", batchResponses)
					await wait(3000)
					await checkStatus(initialData, isBatch)	
				}
				
			}else{

				const { data } = await axios.get(import.meta.env.VITE_JUDGE_LINK + "/submissions/" + initialData.token)
				

				if(data.status.id == 1 || data.status.id == 2){
					console.log("SUBMISSION RESPONSE IS STILL: ", data)
					await wait(3000)
					await checkStatus(initialData, isBatch)
				}else{

					console.log("SUBMISSION RESPONSE IS NOW: ", data)
					setResults(data)
					setCode("")
					setLang({ name:"javascript", id:63 })
					setCase([{input: '', output:''}])
			
				}
	
			}	

			
		} catch (error) {
			console.log(error)
		}
				
	}


	return(
		<>
		<button  type="submit"
			onClick={handleCompile}>Compile and Execute</button>
			{results && <OutputProcessing results={results} isBatch={isBatch} setCode={setCode} setLang={setLang} setCase={setCase}/>}
		</>
	)

}

export default BatchSubmission;