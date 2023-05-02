import React from 'react';

function CustomInput({ customInput, setCustomInput }) {
  return (
    <>
      {' '}
      <input
        type="text"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Custom input"
        // )}
      />
    </>
  );
}

export default CustomInput;
