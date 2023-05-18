import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { AiFillCaretRight } from 'react-icons/ai';
import CodeEditorWindow from './Editor';
// import { classnames } from '../utils/general';
import languageOptions from './languageOption';
import 'react-toastify/dist/ReactToastify.css';
import useKeyPress from '../../hooks/useKeypress';
import OutputWindow from './OutputWindow';
import CustomInput from './CustomInput';
import OutputDetails from './OutputDetails';
import ThemeDropdown from './ThemeDropdown';
import LanguagesDropdown from './LanguagesDropdown';
import classes from './playGround.module.scss';
import LintCall from '../linter/Main';
import ConstructCheck from '../construct-checking/Main';

const showSuccessToast = (msg) => {
  toast.success(msg || 'Compiled Successfully!', {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
const showErrorToast = (msg, timer) => {
  toast.error(msg || 'Something went wrong! Please try again.', {
    position: 'top-right',
    autoClose: timer || 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const javascriptDefault = `/**
* Some Comment
*/
`;

function SampleCode({
  handleEditorData,
  answerFlag, codeId, questionId,
}) {
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState('');
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState('');
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress('Enter');
  const ctrlPress = useKeyPress('Control');

  const onSelectChange = (sl) => {
    console.log('selected Option...', sl);
    setLanguage(sl);
    handleEditorData({
      language: sl?.value,
    });
  };

  const onChange = (action, data) => {
    switch (action) {
      case 'code': {
        setCode(data);
        console.log(code);
        break;
      }
      default: {
        console.warn('case not handled!', action, data);
      }
    }
  };

  const getLanguage = async () => {
    const options = {
      method: 'GET',
      url: `${import.meta.env.VITE_JUDGE_LINK}/languages`,
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        // 'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        // 'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST,
      },
    };

    axios.request(options).then((response) => {
      // console.log(response.data);
    }).catch((error) => {
      console.error(error);
    });
  };
  const handleAnswerData = async (data) => {
    console.log('ANSWER DATA IS: ', data);
    const resulta = await axios.post('/api/answer', data);
    console.log('PLEASE WORK ', resulta);
  };

  const checkStatus = async (token) => {
    const options = {
      method: 'GET',
      //   url: `${process.env.REACT_APP_RAPID_API_URL}/${token}`,
      url: `${import.meta.env.VITE_JUDGE_LINK}/submissions/${token}`,
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        // 'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        // 'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST,
      },
    };
    try {
      const response = await axios.request(options);
      const statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          setOutputDetails(response.data);
          checkStatus(token);
        }, 2000);
        return;
      }
      setProcessing(false);
      setOutputDetails(response.data);
      console.log('PROCESSED DATA: ', response.data);
      if (role === 'student') {
        await handleAnswerData({
          taskId: task_id,
          questionId,
          judgeToken: response.data.token,
          source_code: response.data.source_code,
          language: response.data.language,
          status: response.data.status,
          answer_io: {
            stdin: response.data.stdin,
            stdout: response.data.stdout,
          },
          performance: {
            memory: response.data.memory,
            cputime: response.data.time,
          },
        });
      }
      await handleEditorData({
        time: response.data.time,
        language: language?.value,
        id: response.data.language.id,
        status: response.data.status.description,
        memory: response.data.memory,
        output: atob(outputDetails?.stdout),
        input: customInput,
        code,
        answerFlag,
        questionId,
      }, { codeId });

      showSuccessToast('Compiled Successfully!');
      return;
    } catch (err) {
      console.log('err', err);
      setProcessing(false);
      showErrorToast();
    }
  };
  const handleCompile = async () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };

    const options = {
      method: 'POST',
      //   url: process.env.REACT_APP_RAPID_API_URL,
      url: `${import.meta.env.VITE_JUDGE_LINK}/submissions`,
      params: { base64_encoded: 'true', fields: '*' },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        // // 'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST,
      },
      data: formData,
    };

    axios
      .request(options)
      .then((response) => {
        console.log('res.data', response.data);
        const { token } = response.data;
        checkStatus(token);
      })
      .catch((err) => {
        const error = err.response ? err.response.data : err;
        // get error status
        const { status } = err.response;
        console.log('status', status);
        if (status === 429) {
          console.log('too many requests', status);

          showErrorToast(
            'Quota of 50 requests exceeded for the Day!',
            10000,
          );
        }
        setProcessing(false);
        console.log('catch block...', error);
      });
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log('theme...', theme);
    setTheme(theme);
  }

  useEffect(() => {
    getLanguage();
  }, []);

  useEffect(() => {
    setTheme({ value: 'vs-light', label: 'Light' });
  }, []);

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log('enterPress', enterPress);
      console.log('ctrlPress', ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div>
        <LanguagesDropdown onSelectChange={onSelectChange} className={classes.language} />
        <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        <div className={classes.row}>
          <button
            type="button"
            onClick={handleCompile}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Compile '}
            {' '}
            <AiFillCaretRight />
          </button>
        </div>
      </div>

      <div className={classes.editorBody}>
        <CodeEditorWindow
          code={code}
          onChange={onChange}
          language={language?.value}
          theme={theme.value}
        />
        <label>
          Input
          <CustomInput
            customInput={customInput}
            setCustomInput={setCustomInput}
            className={classes.inputBox}
          />
        </label>

        <div className={classes.outputBox}>

          <hr className={classes.containerline} />
          <OutputWindow outputDetails={outputDetails} />
          {role === 'student'
          && (
          <>
            <LintCall code={code} lang={language.value} />
            <ConstructCheck code={code} lang={language.value} />
          </>
          )}

          {/* <button
            type="button"
            onClick={handleCompile}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Compile and Execute'}
          </button> */}

          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}
export default SampleCode;
