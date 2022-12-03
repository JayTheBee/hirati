import {  useState } from 'react';
import {Buffer} from 'buffer';
import  MonacoEditor from "@monaco-editor/react";
import Select from "react-select";

const OutputDetails = ({output}) => {
  return(
    <>
      <h4>Console Output:</h4>
      <i>{output.stdout}</i>
      <p><b> Status:</b> {output.status.description}</p>
      <p><b>Runtime memory is </b>{output.memory} kb</p>
      <p><b>Runtime is</b> {output.time} seconds</p>
    </>
  )


}

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState({ name:"javascript", id:63 })
  const [processing, setProcessing] = useState(null)
  const [output, setOutput] = useState(null)
  const supportedLang = [{ name:"c", id:50 }, { name:"cpp", id:76 }, { name:"java", id:62 }, { name:"python", id:71 }, { name:"shell", id:46 }, { name:"javascript", id:63 }]

  const handleCompile = async(e) => {
    e.preventDefault()
    setProcessing(true)
    console.log("lang is ", lang)
    console.log("code is ",code)
    const encodedSource = Buffer.from(code).toString('base64')
    console.log("code64 is ", encodedSource)

    const compileResponse = await fetch('http://judge.hirati.app/submissions/?base64_encoded=true',{
      method: 'POST',
		  body: JSON.stringify({
        source_code: encodedSource,
        language_id: lang.id
      }),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      }
    })
		
		const tokenJson = await compileResponse.json()

    if (!compileResponse.ok) {
      setProcessing(false)
		  console.log("err response is ", tokenJson.error)
		}
		if (compileResponse.ok) {
		  console.log('submission token is: ', tokenJson)
      checkStatus(tokenJson.token)
    }
  }

  const checkStatus = async (token) => {
    try{
      let statusResponse = await fetch("http://judge.hirati.app/submissions/"+ token , {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      }) 
      console.log("status resp is ", statusResponse)
      const statusRespJson = await statusResponse.json()
      console.log("statusrespjson is ", statusRespJson)
      let statusId = statusRespJson.status.id 
      
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 3000);
        return;
      } else {
        setProcessing(false)
        setOutput(statusRespJson)
        console.log("it fuckin works. resp is ", statusRespJson)
        return;
      }      

    }catch(err){
      setProcessing(false)
      console.log("checkstatus err is", err)
    }

  }
  


  return (
    <>
      <form className="create-code" onSubmit={handleCompile}> 
        <h2>CODEMIRROR EDITOR COMPONENT</h2>
        <Select
          name="languages"
          options={supportedLang}
          value={lang}
          onChange={setLang}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id} 
        />
        <br />
        <button  type="submit">{processing ? "Processing..." : "Compile and Execute"}</button>
        <MonacoEditor
          height="50vh"
          language={lang.name}
          defaultLanguage="javascript"
          defaultValue="// some comment"
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />
        {output && <OutputDetails output={output}/>}
        <br />
      </form>
    </>

   


  )}




export default CodeEditor;