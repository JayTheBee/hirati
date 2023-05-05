import React from 'react';

function OutputWindow({ outputDetails }) {
  const getOutput = () => {
    const statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre>
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } if (statusId === 3) {
      return (
        <pre>
          {atob(outputDetails.stdout) !== null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </pre>
      );
    } if (statusId === 5) {
      return (
        <pre>
          Time Limit Exceeded
        </pre>
      );
    }
    return (
      <pre>
        {atob(outputDetails?.stderr)}
      </pre>
    );
  };
  return (
    <div>
      <p>
        {outputDetails ? <>{getOutput()}</> : 'Result Output Not Available at the moment . . .'}
      </p>
    </div>
  );
}

export default OutputWindow;
