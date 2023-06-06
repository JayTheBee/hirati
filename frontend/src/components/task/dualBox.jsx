import React, { useState } from 'react';
import DualListBox from 'react-dual-listbox';
import { AiOutlineForward, AiFillBackward } from 'react-icons/ai';
import keywords from './keywords';
import 'react-dual-listbox/lib/react-dual-listbox.css';

function DualBox({ onSelectChange }) {
  const [selected, setSelected] = useState([]);

  const handleChange = (value) => {
    setSelected(value);
    console.log(value);
    onSelectChange(value);
  };
  return (
    <DualListBox
      options={keywords}
      selected={selected}
      onChange={(value) => handleChange(value)}
      icons={{
        moveLeft: <span className="text-white">
          {' '}
          <AiFillBackward />
                  </span>,
        moveAllLeft: [
          <span className="text-white"> Clear All</span>,
        ],
        moveRight: <span className="text-white">
          {' '}
          <AiOutlineForward />
                   </span>,
        moveAllRight: [
          <span className="text-white"> Add All</span>,
        ],
      }}

    />
  );
}
export default DualBox;
