import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AiOutlineSend,
} from 'react-icons/ai';

function AnswerButtonSubmit({ answerData, close }) {
  let code_tokens = [];
  // ARRAY OF THIS v
  //         taskId: task_id,
  //         questionId,
  //         source_code: response.data.source_code, base64
  //         code_tokens: [string] source code tokenized as words
  //         lint results:

  const handleWordtokens = (answerData) => {
    let source_code;
    let tokens;
    answerData.forEach((each, index) => {
      source_code = each?.data?.source_code;
      source_code = atob(source_code);
      console.log('SOURCE CODE IS: ', source_code);
      tokens = source_code?.match(/[a-zA-Z]+/g) || [];
      console.log('SOURCE TOKEN IS: ', tokens);
      answerData[index].code_tokens = tokens;
    });
  };

  const handleSubmitCode = async () => {
    // console.log(answerData);
    // change to answerData
    code_tokens = [];
    handleWordtokens(answerData);
    console.log(answerData);
    console.log(handleWordtokens);

    if (answerData.length > 0) {
    // if (dummyData.length > 0) {
      try {
        answerData.forEach(async (each) => {
        // mongo db insert
          await axios.post(`/api/answer/${each.questionId}`, each);
          console.log(each);
        });

        // controller pass data only
        // await axios.post('/api/answer/', answerData);
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
