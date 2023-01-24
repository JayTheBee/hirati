import axios from 'axios';
import { useState, useEffect, useRef } from 'react';


const BatchDetails = ({data, index}) => {
	return(
		<div key ={data.token}>
			<h1>Case {index + 1}:</h1>
			<h2>Console Output:</h2>
			<i>{data.stdout}</i>
			<h2><b> Status:</b> {data.status.description} </h2>
			<h2><b>Runtime memory is </b>{data.memory} kb</h2>
			<h2><b>Runtime is</b> {data.time} seconds</h2>
		</div>
	)
}
const OutputDetails = ({results, isBatch}) => {
	if(isBatch){

		return(
		<>
			{results.map((element, index) => {
				return <BatchDetails data ={element.data} index={index}/>
			})
			}
		</>
		)
	}else{
		return(
		<>
			<h2>Console Output:</h2>
			<i>{results.stdout}</i>
			<h2><b> Status:</b> {results.status.description} </h2>
			<h2><b>Runtime memory is </b>{results.memory} kb</h2>
			<h2><b>Runtime is</b> {results.time} seconds</h2>
		</>
		)   
	}

}
   
const BatchSubmission = ({code, lang, casevar}) => {
	// const [processing, setProcessing] = useState(true)
	const [results, setResults] = useState(null)
	const [isBatch, setIsBatch] = useState(false)
	const [loaded, setLoaded] = useState(false)
	
	
	// const isInitialMount = useRef(true);

	// useEffect(() => {
	//   if (isInitialMount.current) {
	// 	isInitialMount.current = false;
	//   } else {
	// 	setProcessing(false)
	//   }
	// }, [results]);

	// useEffect(() => {
	// 	if (results) {
	// 		console.log('results state update: ', results);
	// 		setLoaded(true)
	// 	}
	//    }, [results]);
	 

	const handleCompile = async (e) => {
		e.preventDefault()
		// const encodedSource = Buffer.from(code).toString('base64')
		// console.log("code64 is ", encodedSource)
		let url = import.meta.env.VITE_JUDGE_LINK + "/submissions/"
		let data = {
			"language_id": lang.id,
			"source_code": code,
			"stdin":casevar[0].input,
			"expected_output":casevar[0].output,							
		}
		// flag for multiple test cases
		if(casevar.length > 1){
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
			setIsBatch(true)
			data = {submissions: subs}
			url = import.meta.env.VITE_JUDGE_LINK + "/submissions/batch"
		}else{
			setIsBatch(false)
		}
		
		const conf = { 'Content-Type': 'application/json' }
		console.log("req is ", url, data, conf)

		try {
			const postRes = await axios.post(url, data, {"headers": conf})
			console.log("res is ", postRes)
			console.log("data is ", postRes.data)
			await checkStatus(postRes.data, isBatch)

		} catch (error) {
			console.log(error)
		}
	}


	const wait =  (ms = 1000) => {
		return new Promise(resolve => {
			setTimeout(resolve, ms);
		})
	}

	const checkStatus = async (data, isBatch) =>{
		try {
			if(isBatch){
				const subsURL = data.map((element) => import.meta.env.VITE_JUDGE_LINK + "/submissions/" + element.token)
				const requests = subsURL.map((url) => axios.get(url))
				const responses = await Promise.all(requests)
				const status = responses.map(e => e.data.status.id)

				if(!status.includes(1) && !status.includes(2)){
					console.log("resps are ", responses)
					setResults([...responses])
					console.log("results is ", results)
					return responses
				}else{
					await wait(3000)
					await checkStatus(data, isBatch)	
				}
	
			}else{
				const statusResp = await axios.get(import.meta.env.VITE_JUDGE_LINK + "/submissions/" + data.token)
				console.log("statusResp is", statusResp)
				if(statusResp.data.status.id == 1 || statusResp.data.status.id == 2){
					await wait(3000)
					await checkStatus(data, isBatch)
				}else{
					console.log("statusResp now is", statusResp)
					setResults(statusResp.data)
					return statusResp
				}
	
			}				
		} catch (error) {
			console.log(error)
		}
				
	}

	// if(loaded){
	// 	return(
	// 		<>
				
				
	// 		</>
	// 	)
	// }else{
		return(
			<>
			<button  type="submit"
				onClick={handleCompile}>Compile and Execute</button>
				{results && <OutputDetails results={results} isBatch={isBatch}/> }
			</>
		)
	// }



}

export default BatchSubmission;