import axios from 'axios';
import { useState, useEffect } from 'react';

// import {Buffer} from 'buffer';

const OutputDetails = ({results, isBatch}) => {
	if(isBatch){
		return(
		<>
			{results.map( (element, index) => {
				<div key={index}>
					<h4>case {index + 1}: </h4>
					<h4>Console Output:</h4>
					<i>{element.data.stdout}</i>
					<p><b> Status:</b> {element.data.status.description}</p>
					<p><b>Runtime memory is </b>{element.data.memory} kb</p>
					<p><b>Runtime is</b> {element.data.time} seconds</p>
				</div>

				}
				)
			
			
			}
		</>
		)
	}else{
		return(
		<>
			<h4>Console Output:</h4>
			<i>{results.stdout}</i>
			<p><b> Status:</b> {results.status.description}</p>
			<p><b>Runtime memory is </b>{results.memory} kb</p>
			<p><b>Runtime is</b> {results.time} seconds</p>
		</>
		)   
	}

}
   
const BatchSubmission = ({code, lang, casevar}) => {
	// const [code, setCode] = useState("");
	// const [lang, setLang] = useState({ name:"javascript", id:63 })
	// const [processing, setProcessing] = useState(null)
	const [results, setResults] = useState()
	const [isBatch, setIsBatch] = useState(false)
	// const supportedLang = [{ name:"c", id:50 }, { name:"cpp", id:76 }, { name:"java", id:62 }, { name:"python", id:71 }, { name:"shell", id:46 }, { name:"javascript", id:63 }]
	
	useEffect(() => {

		console.log("Changed results: ", results)
  
	 }, [results])

	const handleCompile = async(e) => {
		e.preventDefault()
		console.log("lang is ", lang)
		console.log("code is ", code)
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
		setIsBatch(false)
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
		}
		const conf = { 'Content-Type': 'application/json' }
		console.log("req is ", url, data, conf)
		try {
			const postRes = await axios.post(url, data, {headers: conf})
			console.log("res is ", postRes)
			console.log("data is ", postRes.data)
			const getRes = await checkStatus(postRes.data, isBatch)
			console.log("status is now", getRes)
			setResults(getRes)

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
		if(isBatch){
			const subsURL = data.map((element) => 
				axios.get(import.meta.env.VITE_JUDGE_LINK + "/submissions/" + element.token)
			)
			let statusResp = await Promise.all(subsURL)
			console.log("statusResp is", statusResp)
			let statusArr = statusResp.map((e) => e.data.status.id)
			console.log("statuses is ", statusArr)
			while(statusArr.includes(1) || statusArr.includes(2)){
				console.log("inside while")
				console.log("whatis", subsURL)
				console.log("whatis", statusArr)
				console.log("whatis", statusResp)
				await wait(3000)
				statusResp = await Promise.all(subsURL)
				statusArr = statusResp.map(e => e.data.status.id)
			}
			console.log("statusResp now is", statusResp)
			return statusResp


		}else{
			let statusResp = await axios.get(import.meta.env.VITE_JUDGE_LINK + "/submissions/" + data.token)
			console.log("statusResp is", statusResp)
			while(statusResp.data.status.id == 1 || statusResp.data.status.id == 2){
				await wait(3000)
				statusResp = await axios.get(import.meta.env.VITE_JUDGE_LINK + "/submissions/" + data.token)
			}
			console.log("statusResp now is", statusResp)
			return statusResp.data
		}	
				
	}


	return(
		<>
			<button  type="submit"
			onClick={handleCompile}>Compile and Execute</button>
			{results && <OutputDetails results={results} isBatch={isBatch}/>}
		</>
	)

}

export default BatchSubmission;