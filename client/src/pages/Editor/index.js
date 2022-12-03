import {  useState } from 'react';
import {Buffer} from 'buffer';
import  MonacoEditor from "@monaco-editor/react";
import Select from "react-select";

// import { loadLanguage, langNames, langs } from '@uiw/codemirror-extensions-langs';


const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null)
  const [lang, setLang] = useState({name:"python",langId:71})

 const supportedLang = [{ name:"cpp", langId:76 }, { name:"java", langId:62 }, { name:"python", langId:71 }, { name:"shell", langId:46 }, { name:"javascript", langId:63 }]

  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log("lang is ", lang)
    console.log("code is ",code)
    const encodedSource = Buffer.from(code).toString('base64')
    console.log("code64 is ", encodedSource)

    const response = await fetch('http://192.168.100.219:2358/submissions/?base64_encoded=true',{
      method: 'POST',
		  body: JSON.stringify({
        source_code: encodedSource,
        language_id: lang.langId
      }),
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      }
    })
		
		const json = await response.json()

    if (!response.ok) {
		  setError(json.error)
		  console.log("err response is ", error)
		}
		if (response.ok) {
		  setError(null)
		  console.log('submission token is:', json)
      const tokenresp = await fetch("http://192.168.100.219:2358/submissions/"+ json.token , {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      })
      const tokenrespjson = await tokenresp.json()
      console.log("tokenrespjson is ", tokenrespjson)
    }
  }


  return (
    <>
      <form className="create-code" onSubmit={handleSubmit}> 
        <h2>CODEMIRROR EDITOR COMPONENT</h2>
        {/* <select  value={lang} onChange={handleLangChange}>
          <option value='{ name:"cpp", langId:76 }'>cpp</option>
          <option value='{ name:"java", langId:62 }'>java</option>
          <option value='{ name:"python", langId:71 }'>python</option>
          <option value='{ name:"shell", langId:46 }'>bash</option>
          <option value='{ name:"javascript", langId:63 }'>javascript</option>
        </select> */}
        <Select
          name="languages"
          options={supportedLang}
          value={lang}
          onChange={setLang}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.langId} 
        />
        <br />
        <button  type="submit">send code</button>
        <MonacoEditor
          height="80vh"
          language={lang.name}
          defaultLanguage="javascript"
          defaultValue="// some comment"
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />
        <br />
      </form>
    </>

   


  )}




export default CodeEditor;