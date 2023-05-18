import { useState } from 'react';
import CaseField from './CaseInputs';
import CodeEditor from './EditorView';
import BatchSubmission from './CodeSubmit';
import LintCall from '../linter/Main';
import ConstructCheck from '../construct-checking/Main';

function MainEditor() {
  const [casevar, setCase] = useState([{ input: '', output: '' }]);
  const [code, setCode] = useState('');
  const [lang, setLang] = useState({ name: 'python', id: 71 });

  return (
    <>
      <CaseField casevar={casevar} setCase={setCase} />
      <CodeEditor code={code} setCode={setCode} lang={lang} setLang={setLang} />
      <BatchSubmission
        code={code}
        lang={lang}
        casevar={casevar}
        setCode={setCode}
        setCase={setCase}
        setLang={setLang}
      />
      <LintCall code={code} lang={lang} />
      <ConstructCheck code={code} lang={lang.name} />
    </>
  );
}

export default MainEditor;
