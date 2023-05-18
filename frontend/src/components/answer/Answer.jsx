import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AiOutlineSend,
} from 'react-icons/ai';

function AnswerButtonSubmit({ answerData, close }) {
  const code_tokens = [];

  // const dummyData = [
  //   {
  //     time: '0.028',
  //     language: 'JavaScript',
  //     id: 63,
  //     status: 'Runtime Error (NZEC)',
  //     memory: 7264,
  //     code: "print('yaw')",
  //     answerFlag: true,
  //     output: 'yawa23\n',
  //     input: '',
  //     questionId: '6463a275e6c8ecb5d4beb5eb',
  //   },
  //   {
  //       taskId: 'test3289kj4594tj',
  //       questionId,
  //       source_code: response.data.source_code, base64
  //       code_tokens: [string] source code tokenized as words
  //       lint results:
  //   },
  // ];

  // ARRAY OF THIS v
  //         taskId: task_id,
  //         questionId,
  //         source_code: response.data.source_code, base64
  //         code_tokens: [string] source code tokenized as words
  //         lint results:

  const handleWordtokens = (answerData) => {
    let source_code;
    answerData.forEach((each, i) => {
      // console.log(each.data);
      source_code = each?.data?.source_code;
      const tokens = source_code?.match(/[a-zA-Z]+/g) || [];
      code_tokens.push(tokens);
    });
  };

  const handleSubmitCode = async () => {
    // console.log(answerData);
    // change to answerData
    // handle batchSubmissions here
    // handleWordtokens(answerData.data.source_code);
    console.log(answerData);
    handleWordtokens(answerData);
    console.log(code_tokens);
    // console.log(handleWordtokens);

    if (answerData.length > 0) {
    // if (dummyData.length > 0) {
      try {
        answerData.forEach(async (each) => {
        // dummyData.forEach(async (each) => {
          await axios.post(`/api/answer/${each.questionId}`, each);
        // Promise.a; l;
        //   console.log(each);
        });
        toast.success('All Answers are Submitted!');
        //   close();
      } catch (error) {
        toast.error('Something went wrong');
        console.log(error);
      }
    } else {
      toast.error('Cannot submit uncompiled answers!');
    }
  };
  return (
    <button type="button" onClick={handleSubmitCode} className="d-flex gap-4 justify-content-center align-items-center btn btn-success p-3 rounded-pill fs-4 fw-bolder" style={{ width: '150px' }}>
      Submit All
      <AiOutlineSend />
    </button>
  );
}

export default AnswerButtonSubmit;
