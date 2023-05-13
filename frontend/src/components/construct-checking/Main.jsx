import { useState } from 'react';
import reservedC from '../../constants/c-constructs';
import reservedCPP from '../../constants/cpp-constructs';
import reservedJava from '../../constants/java-constructs';
import reservedPython from '../../constants/python-constructs';

function CheckOutputs({ detectedConstructs }) {
  console.log('did i even reach hre');
  return (
    <>
      <h2>Found Reserved Words:</h2>
      {detectedConstructs.map((element) => (
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
    case 'C':
      reservedWords = reservedC;
      break;
    case 'CPP':
      reservedWords = reservedCPP;
      break;
    case 'Java':
      reservedWords = reservedJava;
      break;
    case 'Python':
      reservedWords = reservedPython;
      break;
    default:
      console.log('Language not detected');
  }

  const [detectedConstructs, setDetectedConstructs] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    const words = code.match(/[a-zA-Z]+/g) || [];
    console.log('CODE IS, ', words);
    const detectedWords = reservedWords.filter((word) => words.includes(word.value));
    console.log('RESERVEDWORDS ???', reservedWords);
    console.log('DETECTED WORDS??? ', detectedWords);
    setDetectedConstructs(detectedWords);
  };

  return (
    <>
      <h1>Construct Checking</h1>
      <button type="submit" onClick={handleSearch}>Check Constructs</button>

      {detectedConstructs.length > 0 && <CheckOutputs detectedConstructs={detectedConstructs} />}
    </>
  );
}

export default ConstructCheck;
