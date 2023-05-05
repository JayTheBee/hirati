// api call to a backend process
import axios from 'axios';
import { useState } from 'react';

function LintOutput({ lintRes }) {
  if (lintRes.status === 0) {
    return (
      <h2>{lintRes.output}</h2>
    );
  // eslint-disable-next-line no-else-return
  } else if (lintRes.status === 1){
    return (<>
      {lintRes.output.map((element, index) => {
			  return (
  <h2 key={index}>{element}</h2>);
			})}
            </>);
  } else {
    return (
      <h2>{lintRes.output}</h2>
    );
  }
}

function LintCall({ code, lang }) {
  const [lintRes, setLintRes] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const conf = { 'Content-Type': 'application/json' };
    const payload = { code };
    const { data } = await axios.post(`/api/lint/${lang.name}`, payload, { headers: conf });
    console.log('data is ', data);
    setLintRes(data);
    console.log('lintres is ', lintRes);
  };
  return (
    <>
      <h1>Linter</h1>
      <button type="submit" onClick={handleSubmit}>Lint</button>
      {lintRes && <LintOutput lintRes={lintRes} />}
    </>
  );
}

export default LintCall;
