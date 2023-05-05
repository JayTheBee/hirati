import React from 'react';
import Select from 'react-select';
import monacoThemes from 'monaco-themes/themes/themelist';
import customStyles from './customStyles';

function ThemeDropdown({ handleThemeChange, theme }) {
  return (
    <Select
      placeholder="Select Theme"
      // options={languageOptions}
      options={[
        { value: 'vs-light', label: 'Light' },
        { value: 'vs-dark', label: 'Dark' },
      ]}
      value={theme}
      styles={customStyles}
      onChange={handleThemeChange}
    />
  );
}

export default ThemeDropdown;
