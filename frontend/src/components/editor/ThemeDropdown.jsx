import React from 'react';
import Select from 'react-select';
import monacoThemes from 'monaco-themes/themes/themelist';
import customStyles from './customStyles';

function ThemeDropdown({ handleThemeChange, theme }) {
  return (
    <Select
      placeholder="Select Theme"
      // options={languageOptions}
      options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
        label: themeName,
        value: themeId,
        key: themeId,
      }))}
      value={theme}
      defaultValue="active4d"
      styles={customStyles}
      onChange={handleThemeChange}
    />
  );
}

export default ThemeDropdown;
