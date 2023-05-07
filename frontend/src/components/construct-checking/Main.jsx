import Select from 'react-select';
import { useState } from 'react';
import reservedC from '../../constants/c-constructs';
import reservedCPP from '../../constants/cpp-constructs';
import reservedJava from '../../constants/java-constructs';
import reservedPython from '../../constants/python-constructs';

function CheckOutputs({ detConstructs }) {
  console.log('did i even reach hre');
  return (
    <>
      <h2>Found Reserved Words:</h2>
      {detConstructs.map((element) => (
        <div key={element.id}>
          <h2>{element.value}</h2>
          <p>{element.category}</p>
        </div>
      ))}
    </>
  );
}

function ConstructCheck({ code, lang }) {
  let reservedWords = reservedPython;

  switch (lang) {
    case 'c':
      reservedWords = reservedC;
      break;
    case 'cpp':
      reservedWords = reservedCPP;
      break;
    case 'java':
      reservedWords = reservedJava;
      break;
    case 'python':
      reservedWords = reservedPython;
      break;
    default:
      console.log('Language not detected');
  }

  const [selectedConstructs, setSelectedConstructs] = useState(new Set([reservedWords[0]]));
  const [detectedConstructs, setDetectedConstructs] = useState([]);

  const handleAddSelect = () => {
    const remainingOptions = reservedWords.filter((option) => !selectedConstructs.has(option));
    const nextOption = remainingOptions[0];
    setSelectedConstructs(new Set([...selectedConstructs, nextOption]));
  };

  const handleRemoveSelect = (index) => {
    const removedOption = [...selectedConstructs][index];
    const newSelectedConstructs = new Set(selectedConstructs);
    newSelectedConstructs.delete(removedOption);
    setSelectedConstructs(newSelectedConstructs);
  };

  const handleChangeSelect = (selectedOption, index) => {
    const newSelectedConstructs = new Set(selectedConstructs);
    const removedOption = [...selectedConstructs][index];
    newSelectedConstructs.delete(removedOption);
    newSelectedConstructs.add(selectedOption);
    setSelectedConstructs(newSelectedConstructs);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const words = code.match(/[a-zA-Z]+/g) || [];
    const detectedWords = reservedWords.filter((word) => words.includes(word.value));
    setDetectedConstructs(detectedWords);
  };

  const reservedArr = reservedWords.filter((option) => !selectedConstructs.has(option));

  return (
    <>
      <h1>Construct Checking</h1>
      <button type="submit" onClick={handleSearch}>Check Constructs</button>

      {Array.from(selectedConstructs).map((option, index) => (
        <div key={option.id}>
          <Select
            name="Construct selects"
            options={reservedArr}
            value={option}
            onChange={(selectedOption) => handleChangeSelect(selectedOption, index)}
            getOptionLabel={(option) => option.value}
          />
          {index > 0 && <button type="button" className="button remove" onClick={() => handleRemoveSelect(index)}>Remove Word</button>}
        </div>
      ))}

      <button className="button add" type="button" onClick={handleAddSelect}>Add More Words</button>

      {detectedConstructs.length > 0 && <CheckOutputs detConstructs={detectedConstructs} />}
    </>
  );
}

export default ConstructCheck;
