// api call to a backend process
import axios from 'axios';
import { useState } from 'react';

function LintOutput({ lintRes }) {
  if (lintRes.status === 0) {
    return (
      <h2>{lintRes.output}</h2>
    );
  // eslint-disable-next-line no-else-return
  } else if (lintRes.status === 1) {
    return (
      <>

        {lintRes.output.map((element) => (
          <h2 key={element.id}>{element.error}</h2>))}
      </>
    );
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
    const { data } = await axios.post(`/api/lint/${lang}`, payload, { headers: conf });
    console.log('data is ', data);
    setLintRes(data);
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
