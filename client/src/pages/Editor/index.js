import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

function Editor() {
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log('value:', value);
  }, []);
  return (
    <div>
      <h2>CODEMIRROR EDITOR COMPONENT</h2>
      <CodeMirror
        value="console.log('hello world!');"
        height="800px"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
    </div>


  );
}
export default Editor;