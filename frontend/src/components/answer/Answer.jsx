import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  AiOutlineSend,
} from 'react-icons/ai';

function AnswerButtonSubmit({ answerData, close }) {
  const dummyData = [
    {
      time: '0.028',
      language: 'JavaScript',
      id: 63,
      status: 'Runtime Error (NZEC)',
      memory: 7264,
      code: "print('yaw')",
      answerFlag: true,
      output: 'yawa23\n',
      input: '',
      code: "print('yawa23')",
      answerFlag: true,
      questionId: '6463a275e6c8ecb5d4beb5eb',
    },
  ];
  const handleSubmitCode = () => {
    // console.log(answerData);
    // change to answerData
    if (dummyData.length > 0) {
      try {
        answerData.forEach(async (each) => {
          await axios.post(`/api/answer/${each.questionId}`, each);
          console.log(each);
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
