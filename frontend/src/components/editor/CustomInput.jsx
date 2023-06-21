import React from 'react';

function CustomInput({ customInput, setCustomInput }) {
  return (
    <>
      {' '}
      <textarea
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
