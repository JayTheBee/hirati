import { useState } from 'react';
import CaseField from './CaseInputs'
import CodeEditor from './EditorView'
import BatchSubmission from './CodeSubmit';

const MainEditor = () => {
	const [casevar, setCase] = useState([{input: '', output:''}])
	const [code, setCode] = useState("");
	const [lang, setLang] = useState({ name:"javascript", id:63 })

	return(
		<>
		<CaseField casevar={casevar} setCase={setCase} />
		<CodeEditor code={code} setCode={setCode} lang={lang} setLang={setLang}/>
		<BatchSubmission code={code} lang={lang} casevar={casevar}/>
		</>
	)



}

export default MainEditor;
