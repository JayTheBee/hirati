import MonacoEditor from '@monaco-editor/react';
import Select from 'react-select';

function CodeEditor({
  code, setCode, lang, setLang,
}) {
  const supportedLang = [{ name: 'c', id: 50 }, { name: 'cpp', id: 76 }, { name: 'java', id: 62 }, { name: 'python', id: 71 }];

  return (
    <>
      <h2>MONACO EDITOR COMPONENT</h2>
      <Select
        name="languages"
        options={supportedLang}
        value={lang}
        onChange={setLang}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.id}
      />
      <br />
      <MonacoEditor
        height="50vh"
        language={lang.name}
        defaultLanguage="javascript"
        defaultValue="// some comment"
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
        colorize
      />
      <br />
    </>

  );
}

export default CodeEditor;
