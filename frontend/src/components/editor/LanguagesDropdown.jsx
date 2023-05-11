import React from 'react';
import Select from 'react-select';
import customStyles from './customStyles';
import languageOptions from './languageOption';

function LanguagesDropdown({ onSelectChange }) {
  return (
    <Select
      placeholder="Set Language"
      options={languageOptions}
      styles={customStyles}
      // defaultValue={languageOptions[0]}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
  );
}

export default LanguagesDropdown;
