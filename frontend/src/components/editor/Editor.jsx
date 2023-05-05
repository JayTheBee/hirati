import React, { useState } from 'react';

import Editor from '@monaco-editor/react';
import classes from './playGround.module.scss';

function CodeEditorWindow({
  onChange, language, code, theme,
}) {
  const [value, setValue] = useState(code || '');

  const handleEditorChange = (value) => {
    setValue(value);
    onChange('code', value);
  };
  return (
    <div className={classes.editor}>
      <Editor
        height="50vh"
        // width="40vw"
        language={language || 'javascript'}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </div>
  );
}
export default CodeEditorWindow;
