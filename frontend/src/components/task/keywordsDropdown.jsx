import React from 'react';
import Select from 'react-select';
import keywords from './keywords';

function KeywordsDropdown({ ref, onSelectChange, passValue }) {
  const defaultVal = [];
  if (passValue) {
    passValue.forEach((each) => {
      defaultVal.push({ label: each, value: each });
    });
  }
  //   console.log(defaultVal);
  return (
    <Select
      ref={ref}
      isMulti
      defaultValue={defaultVal}
      name="colors"
      options={keywords}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Keywords to include ..."
      onChange={onSelectChange}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: 'gray',
          primary: 'black',
        },
      })}
      styles={{
        control: (provided, state) => ({
          ...provided,
          border: state.isFocused && 'none',
          borderRadius: '20px',
          padding: '0px',
          margin: '0px 10px',
          boxShadow: 'none',
          '&:focus': {
            border: '0 !important',
          },
        }),
        placeholder: (provided, state) => ({
          ...provided,
          fontSize: '1.25rem',
        }),
        option: (provided, state) => ({
          ...provided,
          fontSize: '1.25rem',
        }),

        input: (provided, state) => ({
          ...provided,
          fontSize: '1.25rem',
        }),
        multiValue: (base) => ({
          ...base,
          borderRadius: '10px',
          fontSize: '1.5rem',

        }),
      }}

    />
  );
}

export default KeywordsDropdown;
