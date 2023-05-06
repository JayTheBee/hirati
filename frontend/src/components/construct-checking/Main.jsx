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

  switch (lang.name) {
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

  const [reservedArr, setReservedArr] = useState([...reservedWords]);
  const [detConstructs, setDetConstructs] = useState([]); // possibly just an array
  const [selConstructs, setSelConstructs] = useState([reservedArr[0]]);

  console.log('Selected is  ', selConstructs);
  console.log('Remaining options are ', reservedArr);
  console.log('Detected constructs are ', detConstructs);
  console.log('Code is ', code);

  const handleAddSelect = () => {
    setReservedArr(reservedWords.filter((n) => !selConstructs.includes(n)));
    setSelConstructs([...selConstructs, reservedArr[1]]);
  };

  const handleRemoveSelect = (index) => {
    const newConstructs = [...selConstructs];
    newConstructs.splice(index, 1);
    setSelConstructs(newConstructs);
    setReservedArr(reservedWords.filter((n) => !selConstructs.includes(n)));
  };

  const handleChangeSelect = (selectedWord, index) => {
    const newSelConstructs = [...selConstructs];
    newSelConstructs[index] = selectedWord;
    setSelConstructs(newSelConstructs);
    setReservedArr(reservedWords.filter((n) => !selConstructs.includes(n)));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const words = code.match(/[a-zA-Z]+/g);
    console.log('Words array is ', words);
    const detectedWords = reservedWords.filter((obj) => words.includes(obj.value));
    console.log('Detected Words are ', detectedWords);
    setDetConstructs(detectedWords);
  };

  return (
    <>
      <h1>Construct Checking</h1>
      <button type="submit" onClick={handleSearch}>Check Constructs</button>

      {selConstructs.map((element, index) => (
        <div key={element.id}>
          <Select
            name="Construct selects"
            options={reservedArr}
            value={selConstructs[index]}
            onChange={(selectedConstruct) => handleChangeSelect(selectedConstruct, index)}
            getOptionLabel={(option) => option.value}
          //   getOptionValue={(option) => option.value}
          />

          {index > 0 && <button type="button" className="button remove" onClick={() => handleRemoveSelect(index)}>Remove Word</button>}
        </div>

      ))}
      <button className="button add" type="button" onClick={() => handleAddSelect()}>Add More Words</button>
      {detConstructs.length > 0 && <CheckOutputs detConstructs={detConstructs} />}
    </>
  );
}

export default ConstructCheck;
