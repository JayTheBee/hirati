import { useState } from 'react';

function CaseField({ casevar, setCase }) {
  const [activeInput, setActiveInput] = useState([true]);

  const removeCaseFields = (index) => {
    const newCase = [...casevar];
    newCase.splice(index, 1);
    setCase(newCase);

    const newActive = [...activeInput];
    newActive.splice(index, 1);
    setActiveInput(newActive);
  };

  const addCaseFields = () => {
    setCase([...casevar, { input: '', output: '' }]);
    setActiveInput([...activeInput, true]);
  };

  const handleCaseChange = (index, e) => {
    const newCase = [...casevar];
    newCase[index][e.target.name] = e.target.value;
    setCase(newCase);
  };

  const handleActiveChange = (index, bool) => {
    const newActiveArr = [...activeInput];
    newActiveArr[index] = bool;
    setActiveInput(newActiveArr);

    if (!bool) {
      const newCase = [...casevar];
      newCase[index].input = '';
      setCase(newCase);
    }
  };

  const inputField = (element, index) => {
    if (activeInput[index]) {
      return (
        <div className="case-input" key={index}>
          <label htmlFor="input">Input: </label>
          <input
            type="text"
            name="Case Input"
            id="input"
            placeholder="per newline"
            value={element.input}
            onChange={(e) => handleCaseChange(index, e)}
          />
          <button className="button add" type="button" onClick={() => handleActiveChange(index, false)}>No Input</button>
        </div>
      );
    }
    return (
      <>
        <button className="button add" type="button" onClick={() => handleActiveChange(index, true)}>Add Input</button>
        <br />
      </>

    );
  };

  // Render
  return (
    <>
      {casevar.map((element, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className="case-form" key={index}>
          <p>
            Case
            {index + 1}
            :
            {' '}
          </p>
          {inputField(element, index)}

          <label htmlFor="output">Output:</label>
          <input
            type="text"
            name="case output"
            id="output"
            value={element.output}
            onChange={(e) => handleCaseChange(index, e)}
          />
          <br />

          {index
            ? <button type="button" className="button remove" onClick={() => removeCaseFields(index)}>Remove Case</button> : null}
          <br />
          <br />

        </div>
      ))}

      <button className="button add" type="button" onClick={() => addCaseFields()}>Add More Cases</button>

    </>

  );
}
export default CaseField;
