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
        style={{ marginTop: '20px' }} // Add top margin of 10 pixels

      />
    </>
  );
}

export default CustomInput;
