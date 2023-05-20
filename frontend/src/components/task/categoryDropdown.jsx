import React, { useState, useEffect } from 'react';

import CreatableSelect from 'react-select/creatable';
import category from './categoryOptions';

export default function ({ onSelectChange, passValue }) {
  const [selectedCat, setSelectedCat] = useState('passValue');

  return (
    <CreatableSelect
      isClearable
      defaultValue={passValue ? { value: passValue, label: passValue } : ''}
      options={category}
      placeholder="Add Custom Category or Select One"
      onChange={onSelectChange}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: 'gray',
          primary: 'darkgreen',
        },

      })}
      styles={{
        control: (provided, state) => ({
          ...provided,
          border: state.isFocused && 'none',
          borderRadius: '20px',
          width: '300px',
          margin: '0px 10px',
          boxShadow: 'none',
          '&:focus': {
            border: '0 !important',
          },
          fontSize: '1.5rem',
        }),
        placeholder: (provided, state) => ({
          ...provided,
          fontSize: '1.25rem',
        }),
        option: (provided, state) => ({
          ...provided,
          fontSize: '1.5rem',
        }),

        input: (provided, state) => ({
          ...provided,
          fontSize: '1.5rem',
        }),
      }}
    />
  );
}
